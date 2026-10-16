import { z } from "zod";
import { BOOKING_ENUM } from "./booking.interface";

export const createBookingZodSchema = z.object({
  tour: z
    .string({ required_error: "Tour ID is required" })
    .min(1, { message: "Tour ID cannot be empty" }),
  guestCount: z
    .number({ required_error: "Guest count is required" })
    .int({ message: "Guest count must be an integer" })
    .min(1, { message: "Guest count must be at least 1" })
    .max(50, { message: "Guest count cannot exceed 50 per booking" }),
  couponCode: z.string().optional(),
});

export const updateBookingStatusZodSchema = z.object({
  status: z.enum([BOOKING_ENUM.PENDING, BOOKING_ENUM.COMPLETE, BOOKING_ENUM.CANCEL, BOOKING_ENUM.FAILED], {
    required_error: "Booking status is required",
  }),
});
