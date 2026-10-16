"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const mongoose_1 = require("mongoose");
const review_model_1 = require("./review.model");
const tour_model_1 = require("../Tour/tour.model");
const booking_model_1 = require("../Booking/booking.model");
const booking_interface_1 = require("../Booking/booking.interface");
const user_interface_1 = require("../User/user.interface");
const createReview = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findById(payload.tour);
    if (!tour) {
        throw new Error("Tour not found");
    }
    const existingReview = yield review_model_1.Review.findOne({
        user: userId,
        tour: payload.tour,
    });
    if (existingReview) {
        throw new Error("You have already reviewed this tour. You can update your existing review.");
    }
    // Check if user has completed a booking for this tour
    const completedBooking = yield booking_model_1.Booking.findOne({
        user: userId,
        tour: payload.tour,
        status: booking_interface_1.BOOKING_ENUM.COMPLETE,
    });
    const isVerifiedPurchase = !!completedBooking;
    const review = yield review_model_1.Review.create(Object.assign(Object.assign({}, payload), { user: new mongoose_1.Types.ObjectId(userId), tour: new mongoose_1.Types.ObjectId(payload.tour), isVerifiedPurchase }));
    // Update tour's average rating & total count
    yield (0, review_model_1.calculateTourRating)(payload.tour);
    return review.populate("user", "name picture email");
});
const getTourReviews = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ tour: tourId })
        .sort({ createdAt: -1 })
        .populate("user", "name picture email");
    const total = yield review_model_1.Review.countDocuments({ tour: tourId });
    return {
        data: reviews,
        meta: {
            total,
        },
    };
});
const getMyReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("tour", "title slug images location costFrom");
    return reviews;
});
const updateReview = (reviewId, payload, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }
    const isOwner = review.user.toString() === decodedUser.userId;
    const isAdmin = decodedUser.role === user_interface_1.Role.ADMIN || decodedUser.role === user_interface_1.Role.SUPER_ADMIN;
    if (!isOwner && !isAdmin) {
        throw new Error("You are not authorized to update this review");
    }
    const updatedReview = yield review_model_1.Review.findByIdAndUpdate(reviewId, Object.assign({}, payload), { new: true, runValidators: true }).populate("user", "name picture email");
    if (payload.rating) {
        yield (0, review_model_1.calculateTourRating)(review.tour);
    }
    return updatedReview;
});
const deleteReview = (reviewId, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }
    const isOwner = review.user.toString() === decodedUser.userId;
    const isAdmin = decodedUser.role === user_interface_1.Role.ADMIN || decodedUser.role === user_interface_1.Role.SUPER_ADMIN;
    if (!isOwner && !isAdmin) {
        throw new Error("You are not authorized to delete this review");
    }
    const tourId = review.tour;
    yield review_model_1.Review.findByIdAndDelete(reviewId);
    // Recalculate tour average rating
    yield (0, review_model_1.calculateTourRating)(tourId);
    return null;
});
const QueryBulder_1 = require("../utils/QueryBulder");
const getAllReviewsForAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewSearchFields = ["comment"];
    const modelQuery = new QueryBulder_1.QueryBuilder(review_model_1.Review.find()
        .populate("user", "name email picture")
        .populate("tour", "title slug images"), query);
    const reviews = yield modelQuery
        .search(reviewSearchFields)
        .filter()
        .sort()
        .field()
        .pagination();
    const [data, meta] = yield Promise.all([
        reviews.build(),
        modelQuery.Getmeta(),
    ]);
    return {
        data,
        meta,
    };
});
exports.ReviewServices = {
    createReview,
    getTourReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getAllReviewsForAdmin,
};
