import express from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../../MIddleware/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../../MIddleware/validate.user";
import { createReviewZodSchema, updateReviewZodSchema } from "./review.validate";

const router = express.Router();

// Create review (logged-in user)
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

// Get reviews for a specific tour (public)
router.get("/tour/:tourId", ReviewController.getTourReviews);

// Get all reviews for admin table
router.get(
  "/all-reviews",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getAllReviewsForAdmin
);

// Get my reviews (logged-in user)
router.get(
  "/my-reviews",
  checkAuth(...Object.values(Role)),
  ReviewController.getMyReviews
);

// Update review (owner or admin)
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateReviewZodSchema),
  ReviewController.updateReview
);

// Delete review (owner or admin)
router.delete(
  "/:id",
  checkAuth(...Object.values(Role)),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
