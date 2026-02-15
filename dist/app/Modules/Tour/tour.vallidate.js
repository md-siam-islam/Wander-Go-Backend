"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourValidationSchema = exports.tourValidationSchema = void 0;
const zod_1 = require("zod");
exports.tourValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    location: zod_1.z.string().optional(),
    costFrom: zod_1.z.number().optional(),
    startDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    endDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    included: zod_1.z.array(zod_1.z.string()).default([]),
    excluded: zod_1.z.array(zod_1.z.string()).default([]),
    amenities: zod_1.z.array(zod_1.z.string()).default([]),
    tourPlan: zod_1.z.array(zod_1.z.string()).default([]),
    maxGuests: zod_1.z.number().optional(),
    minAge: zod_1.z.number().optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivalLocation: zod_1.z.string().optional(),
    division: zod_1.z.string().min(1, "Division is required"),
    tourType: zod_1.z.string().min(1, "TourType is required"),
});
exports.updateTourValidationSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    costFrom: zod_1.z.number().optional(),
    startDate: zod_1.z.string().optional().optional(),
    endDate: zod_1.z.string().optional().optional(),
    tourType: zod_1.z.string().optional(),
    included: zod_1.z.array(zod_1.z.string()).optional(),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number().optional(),
    minAge: zod_1.z.number().optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivalLocation: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).default([]).optional(),
    deleteImages: zod_1.z.array(zod_1.z.string()).optional()
});
