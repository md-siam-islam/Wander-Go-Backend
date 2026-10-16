"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const validate_user_1 = require("../../../MIddleware/validate.user");
const review_validate_1 = require("./review.validate");
const router = express_1.default.Router();
// Create review (logged-in user)
router.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validate_user_1.validateRequest)(review_validate_1.createReviewZodSchema), review_controller_1.ReviewController.createReview);
// Get reviews for a specific tour (public)
router.get("/tour/:tourId", review_controller_1.ReviewController.getTourReviews);
// Get all reviews for admin table
router.get("/all-reviews", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), review_controller_1.ReviewController.getAllReviewsForAdmin);
// Get my reviews (logged-in user)
router.get("/my-reviews", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), review_controller_1.ReviewController.getMyReviews);
// Update review (owner or admin)
router.patch("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validate_user_1.validateRequest)(review_validate_1.updateReviewZodSchema), review_controller_1.ReviewController.updateReview);
// Delete review (owner or admin)
router.delete("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
