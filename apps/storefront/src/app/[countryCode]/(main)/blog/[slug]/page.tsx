import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBlogPostBySlug } from "@lib/data/blog"
import InteractiveLink from "@modules/common/components/interactive-link"
import { Heading, Text } from "@modules/common/components/ui"

type BlogPostPageProps = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getBlogPostBySlug(slug)

  return {
    title: post ? `${post.title} — Blog` : "Blog",
    description: post?.summary || post?.title,
  }
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="w-full">
      <section className="content-container py-16 small:py-24 flex flex-col gap-8 max-w-3xl">
        <InteractiveLink href="/blog">Back to blog</InteractiveLink>

        <div className="flex flex-col gap-4">
          <Text className="text-clay text-xs tracking-[0.2em] uppercase">
            {post.blog_date} · {post.subject}
          </Text>
          <Heading
            level="h1"
            className="text-espresso text-4xl small:text-5xl leading-[1.1]"
          >
            {post.title}
          </Heading>
          {post.summary && (
            <Text className="text-taupe text-lg leading-relaxed">{post.summary}</Text>
          )}
        </div>

        {post.picture_url && (
          <img
            src={post.picture_url}
            alt=""
            className="w-full max-h-[480px] object-cover rounded-md"
          />
        )}

        <Text className="text-espresso leading-relaxed whitespace-pre-wrap">
          {post.body}
        </Text>
      </section>
    </article>
  )
}
