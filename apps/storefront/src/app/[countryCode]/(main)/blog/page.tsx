import { Metadata } from "next"

import { listBlogPosts } from "@lib/data/blog"
import InteractiveLink from "@modules/common/components/interactive-link"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Blog — Beau magic",
  description:
    "Notes on skincare routines, ingredients, and anti-aging care.",
}

export default async function BlogPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  let posts: Awaited<ReturnType<typeof listBlogPosts>> = []
  let loadError: string | null = null

  try {
    posts = await listBlogPosts()
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load blog posts."
  }

  return (
    <div className="w-full">
      <section className="w-full border-b border-ui-border-base">
        <div className="content-container py-16 small:py-24 flex flex-col items-center text-center gap-4">
          <span className="text-clay text-xs tracking-[0.25em] uppercase">
            Blog
          </span>
          <Heading
            level="h1"
            className="text-espresso text-4xl small:text-6xl leading-[1.05] max-w-3xl"
          >
            Notes on skin
          </Heading>
        </div>
      </section>

      <section className="content-container py-16 small:py-24">
        {loadError && <Text className="text-red-600">{loadError}</Text>}

        {!loadError && posts.length === 0 && (
          <Text className="text-taupe">No blog posts yet.</Text>
        )}

        <div className="flex flex-col gap-10">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-6 border-b border-ui-border-base pb-10"
            >
              {post.picture_url && (
                <img
                  src={post.picture_url}
                  alt=""
                  className="w-full h-48 small:h-full object-cover rounded-md"
                />
              )}
              <div className="flex flex-col gap-3">
                <Text className="text-clay text-xs tracking-[0.2em] uppercase">
                  {post.blog_date} · {post.subject}
                </Text>
                <Heading level="h3" className="text-espresso text-2xl">
                  {post.title}
                </Heading>
                {post.summary && (
                  <Text className="text-taupe leading-relaxed whitespace-pre-wrap">
                    {post.summary}
                  </Text>
                )}
                <InteractiveLink href={`/blog/${post.slug}`}>Read more</InteractiveLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
