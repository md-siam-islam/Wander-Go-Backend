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

export const StatsController = {
    getUserStats
};