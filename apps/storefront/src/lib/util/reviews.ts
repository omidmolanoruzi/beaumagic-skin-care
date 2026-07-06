export type ProductReview = {
  id: string
  product_id: string
  product_handle: string
  rating: number
  title: string | null
  body: string
  author_name: string
  created_at: string
}

export type ReviewSummary = {
  averageRating: number
  totalCount: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}

export function formatReviewerName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return "Anonymous"
  }

  if (parts.length === 1) {
    return parts[0]
  }

  const first = parts[0]
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() ?? ""

  return lastInitial ? `${first} ${lastInitial}.` : first
}

export function buildReviewSummary(
  reviews: Pick<ProductReview, "rating">[]
): ReviewSummary {
  const distribution: ReviewSummary["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  for (const review of reviews) {
    const rating = Math.min(5, Math.max(1, review.rating)) as
      | 1
      | 2
      | 3
      | 4
      | 5
    distribution[rating] += 1
  }

  const totalCount = reviews.length
  const averageRating =
    totalCount === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / totalCount

  return {
    averageRating,
    totalCount,
    distribution,
  }
}
