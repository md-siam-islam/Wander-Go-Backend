import express from "express";
import { WishlistController } from "./wishlist.controller";
import { checkAuth } from "../../../MIddleware/checkAuth";
import { Role } from "../User/user.interface";

const router = express.Router();

// Toggle tour in wishlist (add/remove)
router.post(
  "/toggle/:tourId",
  checkAuth(...Object.values(Role)),
  WishlistController.toggleWishlist
);

// Get logged-in user's wishlist
router.get(
  "/my-wishlist",
  checkAuth(...Object.values(Role)),
  WishlistController.getMyWishlist
);

// Check if a tour is in user's wishlist
router.get(
  "/check/:tourId",
  checkAuth(...Object.values(Role)),
  WishlistController.checkWishlistStatus
);

export const WishlistRoutes = router;
