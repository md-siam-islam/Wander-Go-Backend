import { Types } from "mongoose";

export interface IWishlist {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
