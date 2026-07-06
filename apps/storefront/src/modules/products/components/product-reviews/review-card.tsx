import { ProductReview } from "@lib/util/reviews"
import { Text } from "@modules/common/components/ui"
import StarRating from "./star-rating"

type ReviewCardProps = {
  review: ProductReview
}

function formatReviewDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate))
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-lg bg-ui-bg-component border border-ui-border-base p-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StarRating rating={review.rating} size="sm" />
        <Text as="span" className="text-sm text-ui-fg-muted">
          {formatReviewDate(review.created_at)}
        </Text>
      </div>

      <div className="flex flex-col gap-1">
        <Text as="span" className="font-semibold text-espresso">
          {review.author_name}
        </Text>
        {review.title && (
          <Text as="span" className="text-espresso">
            {review.title}
          </Text>
        )}
      </div>

      <Text className="text-ui-fg-subtle whitespace-pre-line leading-relaxed">
        {review.body}
      </Text>
    </article>
  )
}
