import { Schema, model } from "mongoose";
import { ApplicationStatus, IGuideApplication } from "./guideApplication.interface";

const guideApplicationSchema = new Schema<IGuideApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    nidOrPassport: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    specialties: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: ["Bengali", "English"],
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
      index: true,
    },
    adminFeedback: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const GuideApplication = model<IGuideApplication>(
  "GuideApplication",
  guideApplicationSchema
);
