import httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { OtpService } from "./otp.services";
import { Sendresponse } from "../utils/sendResponse";
import { setCookiesAccessTokenwithRefreshToken } from '../utils/setCookies';

const sendOtp = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const { email } = req.body;

    await OtpService.sendOTP(email);

     Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "OTP sent successfully",
        data : null
    })

})

const verifyOTP = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const { email , otp } = req.body;

    // await OtpService.verifyOTP(email , otp);
    const tokenInfo = await OtpService.verifyOTP(email, otp);

    setCookiesAccessTokenwithRefreshToken(res, tokenInfo)

        Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "OTP verified successfully",
        data : tokenInfo
    })
})


export const OtpController = {
    sendOtp,
    verifyOTP
};