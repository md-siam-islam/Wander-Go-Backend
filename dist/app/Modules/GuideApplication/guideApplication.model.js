"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideApplication = void 0;
const mongoose_1 = require("mongoose");
const guideApplication_interface_1 = require("./guideApplication.interface");
const guideApplicationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(guideApplication_interface_1.ApplicationStatus),
        default: guideApplication_interface_1.ApplicationStatus.PENDING,
        index: true,
    },
    adminFeedback: {
        type: String,
        trim: true,
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.GuideApplication = (0, mongoose_1.model)("GuideApplication", guideApplicationSchema);
