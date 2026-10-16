import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Newspaper } from "@medusajs/icons"
import { Button, Container, Heading, Input, Label, Text, Textarea, toast } from "@medusajs/ui"
import { FormEvent, useEffect, useState } from "react"

type BlogPost = {
  id: string
  blog_date: string
  subject: string
  title: string
  summary: string
  picture_url: string | null
  body: string
}

const STOREFRONT_URL = "http://localhost:8000"

const emptyForm = {
  blogDate: "",
  subject: "",
  title: "",
  summary: "",
  body: "",
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState(emptyForm)

  const loadPosts = async () => {
    const response = await fetch("/admin/blog", { credentials: "include" })

    if (!response.ok) {
      throw new Error("Could not load blog posts.")
    }

    const data = (await response.json()) as { posts: BlogPost[] }
    setPosts(data.posts)
  }

  useEffect(() => {
    loadPosts().catch((error: Error) => {
      toast.error(error.message)
    })
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setIsSaving(true)

    try {
      const response = await fetch("/admin/blog", {
        method: "POST",
        credentials: "include",
        body: new FormData(form),
      })
      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(data.message || "Could not save this blog post.")
      }

      toast.success(editingId ? "Blog post updated" : "Blog post saved")
      setEditingId(null)
      setFormValues(emptyForm)
      form.reset()
      await loadPosts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this blog post.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">{editingId ? "Edit post" : "Blog"}</Heading>
          <Text className="text-ui-fg-subtle">
            {editingId
              ? "Update this post. Leave the picture empty to keep the current one."
              : "Add a post. It appears on the storefront Blog page."}
          </Text>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 px-6 py-4">
          {editingId && <input type="hidden" name="id" value={editingId} />}
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="blog-date">Date of blog</Label>
            <Input
              id="blog-date"
              name="blogDate"
              type="date"
              required
              value={formValues.blogDate}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, blogDate: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="blog-subject">Subject</Label>
            <Input
              id="blog-subject"
              name="subject"
              required
              placeholder="Anti-aging"
              value={formValues.subject}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, subject: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="blog-title">Title</Label>
            <Input
              id="blog-title"
              name="title"
              required
              placeholder="How to build a simple routine"
              value={formValues.title}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, title: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="blog-summary">Summary</Label>
            <Textarea
              id="blog-summary"
              name="summary"
              required
              rows={3}
              placeholder="A short summary of the post..."
              value={formValues.summary}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, summary: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="blog-picture">Picture</Label>
            <Input
              key={editingId ?? "new"}
              id="blog-picture"
              name="picture"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required={!editingId}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="blog-text">Text</Label>
            <Textarea
              id="blog-text"
              name="body"
              required
              rows={6}
              placeholder="Write the blog post..."
              value={formValues.body}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, body: event.target.value }))
              }
            />
          </div>
          <div className="flex gap-x-2">
            <Button type="submit" isLoading={isSaving}>
              {editingId ? "Update blog" : "Save blog"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingId(null)
                  setFormValues(emptyForm)
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Posts</Heading>
        </div>
        {posts.length === 0 ? (
          <Text className="px-6 py-4 text-ui-fg-subtle">No blog posts yet.</Text>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="grid grid-cols-[120px_1fr] gap-4 px-6 py-4">
              {post.picture_url ? (
                <img
                  src={`${STOREFRONT_URL}${post.picture_url}`}
                  alt=""
                  className="h-20 w-full rounded-md object-cover"
                />
              ) : (
                <div />
              )}
              <div>
                <Text className="text-ui-fg-subtle">
                  {post.blog_date} · {post.subject}
                </Text>
                <Heading level="h3">{post.title}</Heading>
                <Text>{post.summary}</Text>
                <Text className="text-ui-fg-subtle">{post.body}</Text>
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    setEditingId(post.id)
                    setFormValues({
                      blogDate: post.blog_date.slice(0, 10),
                      subject: post.subject,
                      title: post.title,
                      summary: post.summary,
                      body: post.body,
                    })
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Blog",
  icon: Newspaper,
})

export default BlogPage
