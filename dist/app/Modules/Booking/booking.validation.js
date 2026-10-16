"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusZodSchema = exports.createBookingZodSchema = void 0;
const zod_1 = require("zod");
const booking_interface_1 = require("./booking.interface");
exports.createBookingZodSchema = zod_1.z.object({
    tour: zod_1.z
        .string({ required_error: "Tour ID is required" })
        .min(1, { message: "Tour ID cannot be empty" }),
    guestCount: zod_1.z
        .number({ required_error: "Guest count is required" })
        .int({ message: "Guest count must be an integer" })
        .min(1, { message: "Guest count must be at least 1" })
        .max(50, { message: "Guest count cannot exceed 50 per booking" }),
    couponCode: zod_1.z.string().optional(),
});
exports.updateBookingStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum([booking_interface_1.BOOKING_ENUM.PENDING, booking_interface_1.BOOKING_ENUM.COMPLETE, booking_interface_1.BOOKING_ENUM.CANCEL, booking_interface_1.BOOKING_ENUM.FAILED], {
        required_error: "Booking status is required",
    }),
});
