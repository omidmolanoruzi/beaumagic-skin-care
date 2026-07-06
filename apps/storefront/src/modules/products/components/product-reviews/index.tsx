import { getReviews } from "@lib/data/reviews"
import { buildReviewSummary } from "@lib/util/reviews"
import { Heading, Text } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import ReviewForm from "./review-form"
import ReviewList from "./review-list"
import ReviewSummaryBlock from "./review-summary"

type ProductReviewsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function ProductReviews({
  product,
  countryCode,
}: ProductReviewsProps) {
  const handle = product.handle!
  const reviews = await getReviews(handle)
  const summary = buildReviewSummary(reviews)

  return (
    <section
      id="reviews"
      className="w-full bg-sand border-t border-ui-border-base scroll-mt-24"
      data-testid="product-reviews-section"
    >
      <div className="content-container py-16 small:py-24">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="text-clay text-xs tracking-[0.25em] uppercase">
            Customer reviews
          </span>
          <Heading level="h2" className="text-espresso text-3xl small:text-4xl">
            What people are saying
          </Heading>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <ReviewSummaryBlock summary={summary} />

          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16">
            <div className="small:order-2">
              <ReviewForm product={product} countryCode={countryCode} />
            </div>
            <div className="small:order-1">
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
