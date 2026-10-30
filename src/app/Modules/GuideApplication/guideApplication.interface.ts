import { Types } from "mongoose";

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IGuideApplication {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  nidOrPassport: string;
  experienceYears: number;
  specialties: string[];
  languages: string[];
  bio: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  adminFeedback?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
