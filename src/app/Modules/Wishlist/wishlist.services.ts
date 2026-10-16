import { Types } from "mongoose";
import { Wishlist } from "./wishlist.model";
import { Tour } from "../Tour/tour.model";

const toggleWishlist = async (tourId: string, userId: string) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }

  const existingItem = await Wishlist.findOne({
    user: userId,
    tour: tourId,
  });

  if (existingItem) {
    await Wishlist.findByIdAndDelete(existingItem._id);
    return {
      isWishlisted: false,
      message: "Removed from wishlist successfully",
    };
  }

  await Wishlist.create({
    user: new Types.ObjectId(userId),
    tour: new Types.ObjectId(tourId),
  });

  return {
    isWishlisted: true,
    message: "Added to wishlist successfully",
  };
};

const getMyWishlist = async (userId: string) => {
  const wishlistItems = await Wishlist.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "tour",
      populate: [
        { path: "division", select: "name slug image" },
        { path: "tourType", select: "name" },
      ],
    });

  return wishlistItems;
};

const checkWishlistStatus = async (tourId: string, userId: string) => {
  const exists = await Wishlist.exists({
    user: userId,
    tour: tourId,
  });

  return {
    isWishlisted: !!exists,
  };
};

export const WishlistServices = {
  toggleWishlist,
  getMyWishlist,
  checkWishlistStatus,
};
