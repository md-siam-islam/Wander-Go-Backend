import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { WishlistServices } from "./wishlist.services";

const toggleWishlist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tourId } = req.params;
  const decodedUser = req.user as JwtPayload;

  const result = await WishlistServices.toggleWishlist(tourId, decodedUser.userId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: result.message,
    data: result,
  });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedUser = req.user as JwtPayload;
  const result = await WishlistServices.getMyWishlist(decodedUser.userId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Wishlist retrieved successfully",
    data: result,
  });
});

const checkWishlistStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tourId } = req.params;
  const decodedUser = req.user as JwtPayload;
  const result = await WishlistServices.checkWishlistStatus(tourId, decodedUser.userId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Wishlist status checked successfully",
    data: result,
  });
});

export const WishlistController = {
  toggleWishlist,
  getMyWishlist,
  checkWishlistStatus,
};
