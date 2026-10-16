"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("./wishlist.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const router = express_1.default.Router();
// Toggle tour in wishlist (add/remove)
router.post("/toggle/:tourId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wishlist_controller_1.WishlistController.toggleWishlist);
// Get logged-in user's wishlist
router.get("/my-wishlist", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wishlist_controller_1.WishlistController.getMyWishlist);
// Check if a tour is in user's wishlist
router.get("/check/:tourId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wishlist_controller_1.WishlistController.checkWishlistStatus);
exports.WishlistRoutes = router;
