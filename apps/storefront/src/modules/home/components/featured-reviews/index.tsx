import { getReviews, pickBestReviews } from "@lib/data/reviews"
import { buildReviewSummary } from "@lib/util/reviews"
import { Heading, Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import StarRating from "@modules/products/components/product-reviews/star-rating"
import FeaturedReviewCard from "./featured-review-card"

const FEATURED_PRODUCT_HANDLE = "cream"

export default async function FeaturedReviews() {
  const allReviews = await getReviews(FEATURED_PRODUCT_HANDLE)
  const reviews = pickBestReviews(allReviews, 3)
  const summary = buildReviewSummary(allReviews)

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-sand border-b border-ui-border-base">
      <div className="content-container py-16 small:py-24">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="text-clay text-xs tracking-[0.25em] uppercase">
            Customer love
          </span>
          <Heading level="h2" className="text-espresso text-3xl small:text-4xl">
            Loved by our community
          </Heading>

          {summary.totalCount > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-ui-fg-muted">
              <StarRating rating={summary.averageRating} size="sm" />
              <span className="text-espresso font-medium">
                {summary.averageRating.toFixed(1)}
              </span>
              <span>
                · {summary.totalCount} review
                {summary.totalCount === 1 ? "" : "s"}
              </span>
            </div>
          )}

          <Text className="text-taupe max-w-xl leading-relaxed">
            Real feedback from people who use Restorative Cream every day.
          </Text>
        </div>

        <ul
          className={`grid grid-cols-1 gap-6 mx-auto ${
            reviews.length === 1
              ? "max-w-lg"
              : reviews.length === 2
                ? "small:grid-cols-2 max-w-4xl"
                : "small:grid-cols-3 max-w-6xl"
          }`}
        >
          {reviews.map((review) => (
            <li key={review.id}>
              <FeaturedReviewCard review={review} />
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-12">
          <InteractiveLink href="/products/cream#reviews">
            Read all reviews
          </InteractiveLink>
        </div>
      </div>
    </section>
  )
}
