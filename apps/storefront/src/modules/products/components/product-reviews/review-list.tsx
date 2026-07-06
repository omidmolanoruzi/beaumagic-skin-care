import { ProductReview } from "@lib/util/reviews"
import { Text } from "@modules/common/components/ui"
import ReviewCard from "./review-card"

type ReviewListProps = {
  reviews: ProductReview[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Text className="text-ui-fg-muted text-center py-8">
        No reviews yet — be the first to share your experience.
      </Text>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
