"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewZodSchema = exports.createReviewZodSchema = void 0;
const zod_1 = require("zod");
exports.createReviewZodSchema = zod_1.z.object({
    tour: zod_1.z.string({ required_error: "Tour ID is required" }).min(1),
    rating: zod_1.z
        .number({ required_error: "Rating is required" })
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
    comment: zod_1.z
        .string({ required_error: "Comment is required" })
        .min(3, "Comment must be at least 3 characters"),
});
exports.updateReviewZodSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5")
        .optional(),
    comment: zod_1.z.string().min(3, "Comment must be at least 3 characters").optional(),
});
