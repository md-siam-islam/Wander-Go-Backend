import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { ReviewServices } from "./review.services";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedUser = req.user as JwtPayload;
  const result = await ReviewServices.createReview(req.body, decodedUser.userId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getTourReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tourId } = req.params;
  const result = await ReviewServices.getTourReviews(tourId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Tour reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedUser = req.user as JwtPayload;
  const result = await ReviewServices.getMyReviews(decodedUser.userId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User reviews retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const decodedUser = req.user as JwtPayload;
  const result = await ReviewServices.updateReview(id, req.body, decodedUser);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const decodedUser = req.user as JwtPayload;
  await ReviewServices.deleteReview(id, decodedUser);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

const getAllReviewsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ReviewServices.getAllReviewsForAdmin(req.query as Record<string, string>);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "All reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const ReviewController = {
  createReview,
  getTourReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviewsForAdmin,
};
