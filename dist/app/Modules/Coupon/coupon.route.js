"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const validate_user_1 = require("../../../MIddleware/validate.user");
const coupon_validate_1 = require("./coupon.validate");
const router = express_1.default.Router();
// Public: Get currently active coupons
router.get("/active", coupon_controller_1.CouponController.getActiveCoupons);
// User: Validate and apply coupon
router.post("/apply", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validate_user_1.validateRequest)(coupon_validate_1.applyCouponZodSchema), coupon_controller_1.CouponController.applyCoupon);
// Admin: Create coupon
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validate_user_1.validateRequest)(coupon_validate_1.createCouponZodSchema), coupon_controller_1.CouponController.createCoupon);
// Admin: Get all coupons
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), coupon_controller_1.CouponController.getAllCoupons);
// Admin: Update coupon
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validate_user_1.validateRequest)(coupon_validate_1.updateCouponZodSchema), coupon_controller_1.CouponController.updateCoupon);
// Admin: Delete coupon
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), coupon_controller_1.CouponController.deleteCoupon);
exports.CouponRoutes = router;
