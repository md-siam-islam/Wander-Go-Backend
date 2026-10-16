import { Types } from "mongoose";
import { IReview } from "./review.interface";
import { Review, calculateTourRating } from "./review.model";
import { Tour } from "../Tour/tour.model";
import { Booking } from "../Booking/booking.model";
import { BOOKING_ENUM } from "../Booking/booking.interface";
import { Role } from "../User/user.interface";
import { JwtPayload } from "jsonwebtoken";

const createReview = async (payload: Partial<IReview>, userId: string) => {
  const tour = await Tour.findById(payload.tour);
  if (!tour) {
    throw new Error("Tour not found");
  }

  const existingReview = await Review.findOne({
    user: userId,
    tour: payload.tour,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this tour. You can update your existing review.");
  }

  // Check if user has completed a booking for this tour
  const completedBooking = await Booking.findOne({
    user: userId,
    tour: payload.tour,
    status: BOOKING_ENUM.COMPLETE,
  });

  const isVerifiedPurchase = !!completedBooking;

  const review = await Review.create({
    ...payload,
    user: new Types.ObjectId(userId),
    tour: new Types.ObjectId(payload.tour as any),
    isVerifiedPurchase,
  });

  // Update tour's average rating & total count
  await calculateTourRating(payload.tour as any);

  return review.populate("user", "name picture email");
};

const getTourReviews = async (tourId: string) => {
  const reviews = await Review.find({ tour: tourId })
    .sort({ createdAt: -1 })
    .populate("user", "name picture email");

  const total = await Review.countDocuments({ tour: tourId });

  return {
    data: reviews,
    meta: {
      total,
    },
  };
};

const getMyReviews = async (userId: string) => {
  const reviews = await Review.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("tour", "title slug images location costFrom");

  return reviews;
};

const updateReview = async (
  reviewId: string,
  payload: Partial<IReview>,
  decodedUser: JwtPayload
) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  const isOwner = review.user.toString() === decodedUser.userId;
  const isAdmin =
    decodedUser.role === Role.ADMIN || decodedUser.role === Role.SUPER_ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("You are not authorized to update this review");
  }

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { ...payload },
    { new: true, runValidators: true }
  ).populate("user", "name picture email");

  if (payload.rating) {
    await calculateTourRating(review.tour);
  }

  return updatedReview;
};

const deleteReview = async (reviewId: string, decodedUser: JwtPayload) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  const isOwner = review.user.toString() === decodedUser.userId;
  const isAdmin =
    decodedUser.role === Role.ADMIN || decodedUser.role === Role.SUPER_ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("You are not authorized to delete this review");
  }

  const tourId = review.tour;
  await Review.findByIdAndDelete(reviewId);

  // Recalculate tour average rating
  await calculateTourRating(tourId);

  return null;
};

import { QueryBuilder } from "../utils/QueryBulder";

const getAllReviewsForAdmin = async (query: Record<string, string>) => {
  const reviewSearchFields = ["comment"];
  const modelQuery = new QueryBuilder(
    Review.find()
      .populate("user", "name email picture")
      .populate("tour", "title slug images"),
    query
  );

  const reviews = await modelQuery
    .search(reviewSearchFields)
    .filter()
    .sort()
    .field()
    .pagination();

  const [data, meta] = await Promise.all([
    reviews.build(),
    modelQuery.Getmeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const ReviewServices = {
  createReview,
  getTourReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviewsForAdmin,
};
