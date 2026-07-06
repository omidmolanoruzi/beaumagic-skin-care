"use server"

import { getPgPool } from "@lib/supabase/db"
import { formatReviewerName } from "@lib/util/reviews"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createReviewSchema = z.object({
  productId: z.string().min(1),
  productHandle: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  authorName: z.string().trim().min(2).max(80),
  authorEmail: z.string().trim().email().max(254),
  title: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => value || undefined),
  body: z.string().trim().min(20).max(2000),
})

export type CreateReviewInput = {
  productId: string
  productHandle: string
  rating: number
  authorName: string
  authorEmail: string
  title?: string
  body: string
  honeypot?: string
  countryCode: string
}

function formatValidationError(error: z.ZodError): string {
  const issue = error.issues[0]

  if (!issue) {
    return "Please check your review and try again."
  }

  if (issue.path[0] === "body" && issue.code === "too_small") {
    return "Please write at least 20 characters in your review."
  }

  if (issue.path[0] === "authorEmail") {
    return "Please enter a valid email address."
  }

  if (issue.path[0] === "authorName") {
    return "Please enter your name."
  }

  if (issue.path[0] === "rating") {
    return "Please select a star rating."
  }

  return "Please check your review and try again."
}

export async function createReview(
  input: CreateReviewInput
): Promise<{ success: true } | { success: false; error: string }> {
  if (input.honeypot?.trim()) {
    return { success: true }
  }

  const parsed = createReviewSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: formatValidationError(parsed.error),
    }
  }

  const pool = getPgPool()
  const displayName = formatReviewerName(parsed.data.authorName)

  try {
    await pool.query(
      `insert into product_reviews (
        product_id, product_handle, rating, title, body, author_name, author_email, status
      ) values ($1, $2, $3, $4, $5, $6, $7, 'published')`,
      [
        parsed.data.productId,
        parsed.data.productHandle,
        parsed.data.rating,
        parsed.data.title || null,
        parsed.data.body,
        displayName,
        parsed.data.authorEmail,
      ]
    )
  } catch (error) {
    console.error("Failed to create review:", error)
    return { success: false, error: "Could not submit review. Please try again." }
  }

  revalidatePath(`/${input.countryCode}/products/${input.productHandle}`)
  revalidatePath(`/${input.countryCode}`)

  return { success: true }
}
