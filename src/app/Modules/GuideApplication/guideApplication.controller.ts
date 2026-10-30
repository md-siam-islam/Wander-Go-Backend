import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { GuideApplicationServices } from "./guideApplication.services";

const applyForGuide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedUser = req.user as JwtPayload;
  const result = await GuideApplicationServices.applyForGuide(req.body, decodedUser);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "Guide application submitted successfully",
    data: result,
  });
});

const getMyApplication = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedUser = req.user as JwtPayload;
  const result = await GuideApplicationServices.getMyApplication(decodedUser.userId);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User guide application retrieved successfully",
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await GuideApplicationServices.getAllApplications(req.query as Record<string, string>);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "All guide applications retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const reviewApplication = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const decodedAdmin = req.user as JwtPayload;
  const result = await GuideApplicationServices.reviewApplication(id, req.body, decodedAdmin);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: `Guide application ${req.body.status?.toLowerCase() || 'updated'} successfully`,
    data: result,
  });
});

const deleteApplication = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await GuideApplicationServices.deleteApplication(id);

  Sendresponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Guide application deleted successfully",
    data: null,
  });
});

export const GuideApplicationController = {
  applyForGuide,
  getMyApplication,
  getAllApplications,
  reviewApplication,
  deleteApplication,
};
