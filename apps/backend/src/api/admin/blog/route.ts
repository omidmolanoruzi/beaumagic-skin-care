import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { IncomingMessage } from "http"

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

const MAX_PICTURE_BYTES = 10 * 1024 * 1024

type BlogRow = {
  id: string
  blog_date: string
  subject: string
  title: string
  summary: string
  picture_url: string | null
  body: string
  created_at: string
}

type PgConnection = {
  raw: (
    sql: string,
    bindings?: unknown[]
  ) => Promise<{ rows: BlogRow[] }>
}

function getPg(req: MedusaRequest) {
  return req.scope.resolve("__pg_connection__") as PgConnection
}

function slugifyTitle(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  return slug || "post"
}

async function uniqueSlug(pg: PgConnection, title: string, excludeId?: string) {
  const base = slugifyTitle(title)
  let slug = base
  let n = 2

  while (true) {
    const existing = await pg.raw(
      `select id from blog_posts where slug = ? and id is distinct from ? limit 1`,
      [slug, excludeId ?? null]
    )

    if (!existing.rows.length) {
      return slug
    }

    slug = `${base}-${n}`
    n += 1
  }
}

async function ensureBlogTable(pg: PgConnection) {
  await pg.raw(`
    create table if not exists public.blog_posts (
      id uuid primary key default gen_random_uuid(),
      blog_date date not null,
      subject text not null,
      title text not null,
      summary text not null default '',
      slug text,
      picture_url text,
      body text not null,
      created_at timestamptz not null default now()
    )
  `)
  await pg.raw(
    `alter table public.blog_posts add column if not exists summary text not null default ''`
  )
  await pg.raw(`alter table public.blog_posts add column if not exists slug text`)

  const missing = await pg.raw(
    `select id, title from blog_posts where slug is null or slug = ''`
  )

  for (const row of missing.rows) {
    const slug = await uniqueSlug(pg, row.title, row.id)
    await pg.raw(`update blog_posts set slug = ? where id = ?`, [slug, row.id])
  }
}

type ParsedUpload = {
  fields: Record<string, string>
  file?: {
    buffer: Buffer
    mimeType: string
    filename: string
  }
}

async function parseUpload(req: IncomingMessage): Promise<ParsedUpload> {
  const busboyModule = await import("busboy")
  return new Promise((resolve, reject) => {
    const createBusboy = (busboyModule.default ?? busboyModule) as (options: {
      headers: IncomingMessage["headers"]
      limits: { fileSize: number }
    }) => NodeJS.EventEmitter & { on: Function }

    const busboy = createBusboy({
      headers: req.headers,
      limits: { fileSize: MAX_PICTURE_BYTES },
    })

    const fields: Record<string, string> = {}
    const chunks: Buffer[] = []
    let file: ParsedUpload["file"]
    let tooLarge = false

    busboy.on("field", (name: string, value: string) => {
      fields[name] = value
    })

    busboy.on(
      "file",
      (
        _name: string,
        stream: NodeJS.ReadableStream & { on: Function },
        info: { filename: string; mimeType: string }
      ) => {
        file = {
          buffer: Buffer.alloc(0),
          filename: info.filename,
          mimeType: info.mimeType,
        }

        stream.on("data", (chunk: Buffer) => {
          chunks.push(chunk)
        })
        stream.on("limit", () => {
          tooLarge = true
        })
      }
    )

    busboy.on("error", reject)
    busboy.on("finish", () => {
      if (tooLarge) {
        reject(new Error("Picture must be smaller than 10 MB."))
        return
      }

      if (file) {
        file.buffer = Buffer.concat(chunks)
      }

      resolve({ fields, file })
    })

    req.pipe(busboy)
  })
}

async function savePicture(file: NonNullable<ParsedUpload["file"]>) {
  if (!IMAGE_TYPES.has(file.mimeType)) {
    throw new Error("Picture must be a JPG, PNG, WEBP, or GIF.")
  }

  const extension =
    file.mimeType === "image/jpeg" ? "jpg" : file.mimeType.split("/")[1]
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
  const directory = path.resolve(
    process.cwd(),
    "../storefront/public/blog-images"
  )

  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, filename), file.buffer)

  return `/blog-images/${filename}`
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pg = getPg(req)
  await ensureBlogTable(pg)

  const result = await pg.raw(
    `select id, blog_date::text as blog_date, subject, title, summary, picture_url, body, created_at
     from blog_posts
     order by blog_date desc, created_at desc`
  )

  res.json({ posts: result.rows })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { fields, file } = await parseUpload(req)
    const blogDate = fields.blogDate?.trim()
    const subject = fields.subject?.trim()
    const title = fields.title?.trim()
    const summary = fields.summary?.trim()
    const body = fields.body?.trim()

    if (!blogDate || !subject || !title || !summary || !body) {
      res.status(400).json({
        message: "Date of blog, subject, title, summary, and text are required.",
      })
      return
    }

    const id = fields.id?.trim()
    const pg = getPg(req)
    await ensureBlogTable(pg)

    if (id) {
      let pictureUrl: string | undefined
      if (file && file.buffer.length > 0) {
        pictureUrl = await savePicture(file)
      }

      const slug = await uniqueSlug(pg, title, id)
      const result = await pg.raw(
        `update blog_posts
         set blog_date = ?, subject = ?, title = ?, slug = ?, summary = ?, body = ?,
             picture_url = coalesce(?, picture_url)
         where id = ?
         returning id`,
        [blogDate, subject, title, slug, summary, body, pictureUrl ?? null, id]
      )

      if (!result.rows.length) {
        res.status(404).json({ message: "Blog post not found." })
        return
      }

      res.json({ id })
      return
    }

    if (!file || file.buffer.length === 0) {
      res.status(400).json({ message: "Please choose a picture." })
      return
    }

    const pictureUrl = await savePicture(file)

    const slug = await uniqueSlug(pg, title)
    await pg.raw(
      `insert into blog_posts (blog_date, subject, title, slug, summary, picture_url, body)
       values (?, ?, ?, ?, ?, ?, ?)`,
      [blogDate, subject, title, slug, summary, pictureUrl, body]
    )

    res.status(201).json({ picture_url: pictureUrl })
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Could not save this blog post.",
    })
  }
}
