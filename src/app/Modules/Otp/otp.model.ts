import { Schema, model } from "mongoose";

export interface IOtp {
    email: string;
    otp: string;
    createdAt?: Date;
}

const otpSchema = new Schema<IOtp>(
    {
        email: { type: String, required: true, index: true },
        otp: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: 120 } // Automatically expires and gets deleted after 2 minutes
    },
    { versionKey: false }
);

export const Otp = model<IOtp>("Otp", otpSchema);
