import "server-only"

import { getPgPool } from "@lib/supabase/db"

export type BlogPost = {
  id: string
  blog_date: string
  subject: string
  title: string
  slug: string
  summary: string
  picture_url: string | null
  body: string
  created_at: string
}

export function slugifyTitle(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  return slug || "post"
}

let tableReady = false

export async function ensureBlogTable() {
  if (tableReady) {
    return
  }

  const pool = getPgPool()

  await pool.query(`
    create table if not exists public.blog_posts (
      id uuid primary key default gen_random_uuid(),
      blog_date date not null,
      subject text not null,
      title text not null,
      summary text not null default '',
      picture_url text,
      body text not null,
      created_at timestamptz not null default now()
    )
  `)
  await pool.query(
    `alter table public.blog_posts add column if not exists summary text not null default ''`
  )
  await pool.query(
    `alter table public.blog_posts add column if not exists slug text`
  )
  await backfillSlugs(pool)

  tableReady = true
}

async function backfillSlugs(pool: ReturnType<typeof getPgPool>) {
  const { rows } = await pool.query<{ id: string; title: string; slug: string | null }>(
    `select id, title, slug from blog_posts`
  )
  const used = new Set(rows.map((row) => row.slug).filter(Boolean) as string[])

  for (const row of rows) {
    if (row.slug) {
      continue
    }

    let slug = slugifyTitle(row.title)
    let n = 2
    while (used.has(slug)) {
      slug = `${slugifyTitle(row.title)}-${n}`
      n += 1
    }

    used.add(slug)
    await pool.query(`update blog_posts set slug = $1 where id = $2`, [slug, row.id])
  }
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  await ensureBlogTable()

  const pool = getPgPool()
  const { rows } = await pool.query<BlogPost>(
    `select id, blog_date::text, subject, title, slug, summary, picture_url, body, created_at
     from blog_posts
     order by blog_date desc, created_at desc`
  )

  return rows
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  await ensureBlogTable()

  const pool = getPgPool()
  const { rows } = await pool.query<BlogPost>(
    `select id, blog_date::text, subject, title, slug, summary, picture_url, body, created_at
     from blog_posts
     where slug = $1`,
    [slug]
  )

  return rows[0] ?? null
}
