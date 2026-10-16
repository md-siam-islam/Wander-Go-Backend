import { z } from "zod";
import { DISCOUNT_TYPE } from "./coupon.interface";

export const createCouponZodSchema = z.object({
  code: z
    .string({ required_error: "Coupon code is required" })
    .min(3, "Coupon code must be at least 3 characters")
    .toUpperCase(),
  discountType: z.enum([DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FLAT], {
    required_error: "Discount type is required",
  }),
  discountValue: z
    .number({ required_error: "Discount value is required" })
    .positive("Discount value must be greater than zero"),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startDate: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  expiryDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date({ required_error: "Expiry date is required" })
  ),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const updateCouponZodSchema = z.object({
  discountType: z.enum([DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FLAT]).optional(),
  discountValue: z.number().positive().optional(),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startDate: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  expiryDate: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const applyCouponZodSchema = z.object({
  code: z.string({ required_error: "Coupon code is required" }).min(1),
  totalAmount: z
    .number({ required_error: "Total amount is required" })
    .positive("Total amount must be greater than zero"),
});
