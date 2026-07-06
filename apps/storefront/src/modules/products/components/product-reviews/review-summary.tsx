import { ReviewSummary } from "@lib/util/reviews"
import { Text } from "@modules/common/components/ui"
import StarRating from "./star-rating"

type ReviewSummaryBlockProps = {
  summary: ReviewSummary
}

export default function ReviewSummaryBlock({ summary }: ReviewSummaryBlockProps) {
  const { averageRating, totalCount, distribution } = summary
  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div className="flex flex-col small:flex-row gap-10 small:gap-16">
      <div className="flex flex-col items-center small:items-start gap-2 min-w-[140px]">
        <span className="text-5xl font-serif text-espresso leading-none">
          {totalCount > 0 ? averageRating.toFixed(1) : "—"}
        </span>
        <StarRating
          rating={totalCount > 0 ? averageRating : 0}
          size="lg"
        />
        <Text className="text-sm text-ui-fg-muted">
          {totalCount === 0
            ? "No reviews yet"
            : `Based on ${totalCount} review${totalCount === 1 ? "" : "s"}`}
        </Text>
      </div>

      <div className="flex-1 flex flex-col gap-2 w-full max-w-md">
        {([5, 4, 3, 2, 1] as const).map((stars) => {
          const count = distribution[stars]
          const width = totalCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <span className="w-8 text-ui-fg-muted shrink-0">{stars} ★</span>
              <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full rounded-full bg-clay transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-6 text-right text-ui-fg-muted shrink-0">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
