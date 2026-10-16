import { Types } from "mongoose";

export interface IReview {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  rating: number;
  comment: string;
  isVerifiedPurchase?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
