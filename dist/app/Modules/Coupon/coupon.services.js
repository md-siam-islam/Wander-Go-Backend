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
exports.CouponServices = void 0;
const coupon_interface_1 = require("./coupon.interface");
const coupon_model_1 = require("./coupon.model");
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield coupon_model_1.Coupon.findOne({ code: payload.code.toUpperCase() });
    if (existing) {
        throw new Error("Coupon code already exists");
    }
    const coupon = yield coupon_model_1.Coupon.create(Object.assign(Object.assign({}, payload), { code: payload.code.toUpperCase() }));
    return coupon;
});
const getAllCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupon_model_1.Coupon.find().sort({ createdAt: -1 });
    const total = yield coupon_model_1.Coupon.countDocuments();
    return {
        data: coupons,
        meta: {
            total,
        },
    };
});
const getActiveCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const coupons = yield coupon_model_1.Coupon.find({
        isActive: true,
        expiryDate: { $gte: now },
    }).select("-usedCount");
    return coupons;
});
const updateCoupon = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new Error("Coupon not found");
    }
    const updated = yield coupon_model_1.Coupon.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updated;
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new Error("Coupon not found");
    }
    yield coupon_model_1.Coupon.findByIdAndDelete(id);
    return null;
});
const applyCoupon = (code, totalAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
    });
    if (!coupon) {
        throw new Error("Invalid or inactive coupon code");
    }
    const now = new Date();
    if (coupon.expiryDate < now) {
        throw new Error("Coupon has expired");
    }
    if (coupon.startDate && coupon.startDate > now) {
        throw new Error("Coupon is not active yet");
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit has been reached");
    }
    if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
        throw new Error(`Minimum purchase of BDT ${coupon.minPurchaseAmount} is required to use this coupon`);
    }
    let discountAmount = 0;
    if (coupon.discountType === coupon_interface_1.DISCOUNT_TYPE.PERCENTAGE) {
        discountAmount = (totalAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
        }
    }
    else if (coupon.discountType === coupon_interface_1.DISCOUNT_TYPE.FLAT) {
        discountAmount = coupon.discountValue;
    }
    // Ensure discount does not exceed total amount
    if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
    }
    const finalAmount = Math.max(0, totalAmount - discountAmount);
    return {
        valid: true,
        code: coupon.code,
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(finalAmount),
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
    };
});
exports.CouponServices = {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
};
