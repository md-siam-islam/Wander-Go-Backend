"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tour: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Unique compound index so a user cannot add the same tour twice
wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });
exports.Wishlist = (0, mongoose_1.model)("Wishlist", wishlistSchema);
