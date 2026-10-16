"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 120 } // Automatically expires and gets deleted after 2 minutes
}, { versionKey: false });
exports.Otp = (0, mongoose_1.model)("Otp", otpSchema);
