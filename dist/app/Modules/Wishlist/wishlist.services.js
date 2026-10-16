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
exports.WishlistServices = void 0;
const mongoose_1 = require("mongoose");
const wishlist_model_1 = require("./wishlist.model");
const tour_model_1 = require("../Tour/tour.model");
const toggleWishlist = (tourId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findById(tourId);
    if (!tour) {
        throw new Error("Tour not found");
    }
    const existingItem = yield wishlist_model_1.Wishlist.findOne({
        user: userId,
        tour: tourId,
    });
    if (existingItem) {
        yield wishlist_model_1.Wishlist.findByIdAndDelete(existingItem._id);
        return {
            isWishlisted: false,
            message: "Removed from wishlist successfully",
        };
    }
    yield wishlist_model_1.Wishlist.create({
        user: new mongoose_1.Types.ObjectId(userId),
        tour: new mongoose_1.Types.ObjectId(tourId),
    });
    return {
        isWishlisted: true,
        message: "Added to wishlist successfully",
    };
});
const getMyWishlist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistItems = yield wishlist_model_1.Wishlist.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
        path: "tour",
        populate: [
            { path: "division", select: "name slug image" },
            { path: "tourType", select: "name" },
        ],
    });
    return wishlistItems;
});
const checkWishlistStatus = (tourId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield wishlist_model_1.Wishlist.exists({
        user: userId,
        tour: tourId,
    });
    return {
        isWishlisted: !!exists,
    };
});
exports.WishlistServices = {
    toggleWishlist,
    getMyWishlist,
    checkWishlistStatus,
};
