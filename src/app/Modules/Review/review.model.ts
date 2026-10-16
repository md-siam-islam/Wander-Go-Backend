import { Schema, model, Types } from "mongoose";
import { IReview } from "./review.interface";
import { Tour } from "../Tour/tour.model";

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// One review per user per tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

export const calculateTourRating = async (tourId: Types.ObjectId | string) => {
  const objectId = typeof tourId === "string" ? new Types.ObjectId(tourId) : tourId;

  const stats = await Review.aggregate([
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
    await Tour.findByIdAndUpdate(objectId, {
      totalRatings: stats[0].totalRatings,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await Tour.findByIdAndUpdate(objectId, {
      totalRatings: 0,
      averageRating: 0,
    });
  }
};

export const Review = model<IReview>("Review", reviewSchema);
