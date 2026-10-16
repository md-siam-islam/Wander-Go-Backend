import { z } from "zod";

export const createReviewZodSchema = z.object({
  tour: z.string({ required_error: "Tour ID is required" }).min(1),
  rating: z
    .number({ required_error: "Rating is required" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string({ required_error: "Comment is required" })
    .min(3, "Comment must be at least 3 characters"),
});

export const updateReviewZodSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  comment: z.string().min(3, "Comment must be at least 3 characters").optional(),
});
