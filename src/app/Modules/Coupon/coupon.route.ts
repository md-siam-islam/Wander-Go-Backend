import express from "express";
import { CouponController } from "./coupon.controller";
import { checkAuth } from "../../../MIddleware/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../../MIddleware/validate.user";
import {
  createCouponZodSchema,
  updateCouponZodSchema,
  applyCouponZodSchema,
} from "./coupon.validate";

const router = express.Router();

// Public: Get currently active coupons
router.get("/active", CouponController.getActiveCoupons);

// User: Validate and apply coupon
router.post(
  "/apply",
  checkAuth(...Object.values(Role)),
  validateRequest(applyCouponZodSchema),
  CouponController.applyCoupon
);

// Admin: Create coupon
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createCouponZodSchema),
  CouponController.createCoupon
);

// Admin: Get all coupons
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponController.getAllCoupons
);

// Admin: Update coupon
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateCouponZodSchema),
  CouponController.updateCoupon
);

// Admin: Delete coupon
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponController.deleteCoupon
);

export const CouponRoutes = router;
