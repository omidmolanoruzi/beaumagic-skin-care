import "server-only"

import { getPgPool } from "@lib/supabase/db"
import {
  buildReviewSummary,
  ProductReview,
  ReviewSummary,
} from "@lib/util/reviews"
import { cache } from "react"

async function fetchReviews(productHandle: string): Promise<ProductReview[]> {
  const pool = getPgPool()

  const { rows } = await pool.query<ProductReview>(
    `select id, product_id, product_handle, rating, title, body, author_name, created_at
     from product_reviews
     where product_handle = $1 and status = 'published'
     order by created_at desc`,
    [productHandle]
  )

  return rows
}

/** One DB round-trip per product per page render (deduped via React cache). */
export const getReviews = cache(async (productHandle: string) => {
  return fetchReviews(productHandle)
})

export const getReviewSummary = cache(
  async (productHandle: string): Promise<ReviewSummary> => {
    const reviews = await getReviews(productHandle)
    return buildReviewSummary(reviews)
  }
)

export function pickBestReviews(
  reviews: ProductReview[],
  limit = 3
): ProductReview[] {
  return [...reviews]
    .filter((review) => review.rating >= 4)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    })
    .slice(0, limit)
}

export const getBestReviews = cache(
  async (productHandle: string, limit = 3): Promise<ProductReview[]> => {
    const reviews = await getReviews(productHandle)
    return pickBestReviews(reviews, limit)
  }
)
