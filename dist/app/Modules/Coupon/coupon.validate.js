"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCouponZodSchema = exports.updateCouponZodSchema = exports.createCouponZodSchema = void 0;
const zod_1 = require("zod");
const coupon_interface_1 = require("./coupon.interface");
exports.createCouponZodSchema = zod_1.z.object({
    code: zod_1.z
        .string({ required_error: "Coupon code is required" })
        .min(3, "Coupon code must be at least 3 characters")
        .toUpperCase(),
    discountType: zod_1.z.enum([coupon_interface_1.DISCOUNT_TYPE.PERCENTAGE, coupon_interface_1.DISCOUNT_TYPE.FLAT], {
        required_error: "Discount type is required",
    }),
    discountValue: zod_1.z
        .number({ required_error: "Discount value is required" })
        .positive("Discount value must be greater than zero"),
    minPurchaseAmount: zod_1.z.number().min(0).optional(),
    maxDiscountAmount: zod_1.z.number().min(0).optional(),
    startDate: zod_1.z
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    expiryDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date({ required_error: "Expiry date is required" })),
    usageLimit: zod_1.z.number().int().positive().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateCouponZodSchema = zod_1.z.object({
    discountType: zod_1.z.enum([coupon_interface_1.DISCOUNT_TYPE.PERCENTAGE, coupon_interface_1.DISCOUNT_TYPE.FLAT]).optional(),
    discountValue: zod_1.z.number().positive().optional(),
    minPurchaseAmount: zod_1.z.number().min(0).optional(),
    maxDiscountAmount: zod_1.z.number().min(0).optional(),
    startDate: zod_1.z
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    expiryDate: zod_1.z
        .preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    usageLimit: zod_1.z.number().int().positive().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.applyCouponZodSchema = zod_1.z.object({
    code: zod_1.z.string({ required_error: "Coupon code is required" }).min(1),
    totalAmount: zod_1.z
        .number({ required_error: "Total amount is required" })
        .positive("Total amount must be greater than zero"),
});
