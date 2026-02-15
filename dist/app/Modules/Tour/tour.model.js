"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const TourtypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true
});
exports.TourType = (0, mongoose_1.model)("TourType", TourtypeSchema);
const TourSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGests: { type: Number },
    minAge: { type: Number },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    division: { type: mongoose_1.Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: mongoose_1.Schema.Types.ObjectId, ref: "TourType", required: true },
    deletedImages: { type: [String], default: [] }
}, {
    timestamps: true
});
exports.Tour = (0, mongoose_1.model)("Tour", TourSchema);
