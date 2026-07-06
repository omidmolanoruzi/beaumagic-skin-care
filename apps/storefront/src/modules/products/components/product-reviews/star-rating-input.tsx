"use client"

import clsx from "clsx"
import { useState } from "react"

type StarRatingInputProps = {
  value: number
  onChange: (value: number) => void
  name?: string
}

export default function StarRatingInput({
  value,
  onChange,
  name = "rating",
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value || ""} />
      <div
        className="inline-flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1
          const active = starValue <= (hovered || value)

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              className={clsx(
                "text-2xl leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay rounded",
                active ? "text-clay" : "text-sandborder hover:text-clay/70"
              )}
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(starValue)}
            >
              ★
            </button>
          )
        })}
      </div>
    </div>
  )
}
