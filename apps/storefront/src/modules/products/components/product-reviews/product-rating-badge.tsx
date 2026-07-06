import { getReviewSummary } from "@lib/data/reviews"
import StarRating from "@modules/products/components/product-reviews/star-rating"

type ProductRatingBadgeProps = {
  productHandle: string
}

export default async function ProductRatingBadge({
  productHandle,
}: ProductRatingBadgeProps) {
  const summary = await getReviewSummary(productHandle)

  if (summary.totalCount === 0) {
    return (
      <a
        href="#reviews"
        className="text-sm text-ui-fg-muted hover:text-clay transition-colors"
      >
        Be the first to review
      </a>
    )
  }

  return (
    <a
      href="#reviews"
      className="inline-flex flex-wrap items-center gap-2 text-sm text-ui-fg-muted hover:text-clay transition-colors"
    >
      <StarRating rating={summary.averageRating} size="sm" />
      <span className="text-espresso font-medium">
        {summary.averageRating.toFixed(1)}
      </span>
      <span>
        · {summary.totalCount} review{summary.totalCount === 1 ? "" : "s"}
      </span>
    </a>
  )
}
