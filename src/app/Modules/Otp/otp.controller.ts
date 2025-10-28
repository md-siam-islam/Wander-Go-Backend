import httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { OtpService } from "./otp.services";
import { Sendresponse } from "../utils/sendResponse";

const sendOtp = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const { email , name } = req.body;

    await OtpService.sendOTP(email , name);

     Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "OTP sent successfully",
        data : null
    })

})

const verifyOTP = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const { email , otp } = req.body;

    await OtpService.verifyOTP(email , otp);

         Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "OTP verified successfully",
        data : null
    })
})


export const OtpController = {
    sendOtp,
    verifyOTP
};