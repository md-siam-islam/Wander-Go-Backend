import { Schema, model } from "mongoose";
import { IWishlist } from "./wishlist.interface";

const wishlistSchema = new Schema<IWishlist>(
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique compound index so a user cannot add the same tour twice
wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
