"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = exports.calculateTourRating = void 0;
const mongoose_1 = require("mongoose");
const tour_model_1 = require("../Tour/tour.model");
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tour: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// One review per user per tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });
const calculateTourRating = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = typeof tourId === "string" ? new mongoose_1.Types.ObjectId(tourId) : tourId;
    const stats = yield exports.Review.aggregate([
        { $match: { tour: objectId } },
        {
            $group: {
                _id: "$tour",
                totalRatings: { $sum: 1 },
                averageRating: { $avg: "$rating" },
            },
        },
    ]);
    if (stats.length > 0) {
        yield tour_model_1.Tour.findByIdAndUpdate(objectId, {
            totalRatings: stats[0].totalRatings,
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
        });
    }
    else {
        yield tour_model_1.Tour.findByIdAndUpdate(objectId, {
            totalRatings: 0,
            averageRating: 0,
        });
    }
});
exports.calculateTourRating = calculateTourRating;
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
