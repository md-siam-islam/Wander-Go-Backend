import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { CouponServices } from "./coupon.services";

const createCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await CouponServices.createCoupon(req.body);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "Coupon created successfully",
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await CouponServices.getAllCoupons();

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Coupons retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getActiveCoupons = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await CouponServices.getActiveCoupons();

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Active coupons retrieved successfully",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await CouponServices.updateCoupon(id, req.body);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await CouponServices.deleteCoupon(id);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Coupon deleted successfully",
    data: null,
  });
});

const applyCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { code, totalAmount } = req.body;
  const result = await CouponServices.applyCoupon(code, Number(totalAmount));

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Coupon applied successfully",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
