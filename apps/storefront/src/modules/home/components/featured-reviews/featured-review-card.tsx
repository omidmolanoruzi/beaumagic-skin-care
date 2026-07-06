import { ProductReview } from "@lib/util/reviews"
import { Text } from "@modules/common/components/ui"
import StarRating from "@modules/products/components/product-reviews/star-rating"

type FeaturedReviewCardProps = {
  review: ProductReview
}

export default function FeaturedReviewCard({ review }: FeaturedReviewCardProps) {
  return (
    <figure className="flex flex-col gap-4 rounded-lg bg-ui-bg-component border border-ui-border-base p-8 h-full">
      <StarRating rating={review.rating} size="md" />

      {review.title ? (
        <blockquote className="font-serif text-espresso text-xl leading-snug">
          &ldquo;{review.title}&rdquo;
        </blockquote>
      ) : null}

      <Text className="text-ui-fg-subtle leading-relaxed line-clamp-4 flex-1">
        {review.body}
      </Text>

      <figcaption className="text-sm text-ui-fg-muted pt-2 border-t border-ui-border-base">
        — {review.author_name}
      </figcaption>
    </figure>
  )
}
