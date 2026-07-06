"use client"

import { createReview } from "@lib/data/review-actions"
import { Button, Input, Label, Text } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { FormEvent, useState, useTransition } from "react"
import StarRatingInput from "./star-rating-input"

type ReviewFormProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default function ReviewForm({ product, countryCode }: ReviewFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rating, setRating] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!rating) {
      setError("Please select a star rating.")
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await createReview({
        productId: product.id!,
        productHandle: product.handle!,
        rating,
        authorName: String(formData.get("authorName") ?? ""),
        authorEmail: String(formData.get("authorEmail") ?? ""),
        title: String(formData.get("title") ?? ""),
        body: String(formData.get("body") ?? ""),
        honeypot: String(formData.get("_hp_confirm") ?? ""),
        countryCode,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      setSuccess(true)
      setRating(0)
      form.reset()
      router.refresh()
    })
  }

  return (
    <div id="write-review" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Text as="span" className="font-semibold text-espresso text-lg">
          Write a review
        </Text>
        <Text className="text-sm text-ui-fg-muted">
          Share your experience with {product.title}.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="_hp_confirm">Leave blank</label>
          <input
            id="_hp_confirm"
            type="text"
            name="_hp_confirm"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Your rating</Label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <Input
          name="authorName"
          label="Name"
          required
          placeholder="Sarah Mitchell"
          autoComplete="name"
        />

        <Input
          name="authorEmail"
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
        />

        <Input
          name="title"
          label="Headline (optional)"
          placeholder="Perfect for sensitive skin"
        />

        <div className="flex flex-col gap-1">
          <Label htmlFor="review-body">Your review</Label>
          <textarea
            id="review-body"
            name="body"
            required
            minLength={20}
            rows={5}
            placeholder="Tell us what you liked about this product..."
            className="flex w-full rounded-md border border-sandborder bg-white px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2"
          />
        </div>

        {error && (
          <Text className="text-sm text-red-600" role="alert">
            {error}
          </Text>
        )}

        {success && (
          <Text className="text-sm text-clay" role="status">
            Thank you — your review has been published.
          </Text>
        )}

        <Button type="submit" isLoading={isPending} className="self-start">
          Submit review
        </Button>
      </form>
    </div>
  )
}
