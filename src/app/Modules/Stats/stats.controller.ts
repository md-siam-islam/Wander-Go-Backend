import httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { StatsService } from './stats.servics';


const getUserStats = catchAsync(async (req:Request , res: Response , next: NextFunction) => {

    const stats = await StatsService.getUserStats();

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "User stats fetched successfully",
        data : stats
    })
});

const getDashboardStats = catchAsync(async (req:Request , res: Response , next: NextFunction) => {

    const stats = await StatsService.getAdminDashboardStats();

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Admin dashboard stats fetched successfully",
        data : stats
    })
});

const getMonthlyAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await StatsService.getMonthlyAnalytics();

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Monthly analytics fetched successfully",
        data: stats,
    });
});

const getTourDistributionStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await StatsService.getTourDistributionStats();

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Tour distribution stats fetched successfully",
        data: stats,
    });
});

export const StatsController = {
    getUserStats,
    getDashboardStats,
    getMonthlyAnalytics,
    getTourDistributionStats
};