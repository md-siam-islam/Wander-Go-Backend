import { DISCOUNT_TYPE, ICoupon } from "./coupon.interface";
import { Coupon } from "./coupon.model";

const createCoupon = async (payload: ICoupon) => {
  const existing = await Coupon.findOne({ code: payload.code.toUpperCase() });
  if (existing) {
    throw new Error("Coupon code already exists");
  }

  const coupon = await Coupon.create({
    ...payload,
    code: payload.code.toUpperCase(),
  });

  return coupon;
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  const total = await Coupon.countDocuments();

  return {
    data: coupons,
    meta: {
      total,
    },
  };
};

const getActiveCoupons = async () => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    expiryDate: { $gte: now },
  }).select("-usedCount");

  return coupons;
};

const updateCoupon = async (id: string, payload: Partial<ICoupon>) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const updated = await Coupon.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

const deleteCoupon = async (id: string) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new Error("Coupon not found");
  }

  await Coupon.findByIdAndDelete(id);
  return null;
};

const applyCoupon = async (code: string, totalAmount: number) => {
  const coupon = await Coupon.findOne({
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
    throw new Error(
      `Minimum purchase of BDT ${coupon.minPurchaseAmount} is required to use this coupon`
    );
  }

  let discountAmount = 0;
  if (coupon.discountType === DISCOUNT_TYPE.PERCENTAGE) {
    discountAmount = (totalAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else if (coupon.discountType === DISCOUNT_TYPE.FLAT) {
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
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
