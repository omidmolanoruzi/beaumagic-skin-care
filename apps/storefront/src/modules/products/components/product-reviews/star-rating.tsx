"use client"

import clsx from "clsx"

type StarRatingProps = {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "text-sm gap-0.5",
  md: "text-base gap-0.5",
  lg: "text-2xl gap-1",
}

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  className,
}: StarRatingProps) {
  return (
    <div
      className={clsx("inline-flex items-center text-clay", sizeClasses[size], className)}
      aria-label={`${rating.toFixed(1)} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => {
        const fill = Math.min(1, Math.max(0, rating - index))

        return (
          <span key={index} className="relative inline-block leading-none">
            <span className="text-sandborder">★</span>
            <span
              className="absolute inset-0 overflow-hidden text-clay"
              style={{ width: `${fill * 100}%` }}
              aria-hidden
            >
              ★
            </span>
          </span>
        )
      })}
    </div>
  )
}
