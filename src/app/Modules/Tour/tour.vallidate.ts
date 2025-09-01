
import { z } from "zod";

export const tourValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  endDate: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  tourPlan: z.array(z.string()).default([]),
  maxGests: z.number().optional(),
  minAge: z.number().optional(),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "TourType is required"),
});
