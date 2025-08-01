import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AuthServices } from "./auth.services"
import { Sendresponse } from "../utils/sendResponse"
import httpStatus from "http-status-codes"
import { setCookiesAccessTokenwithRefreshToken } from "../utils/setCookies"


const LoginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.CredentialLogin(req.body)

    setCookiesAccessTokenwithRefreshToken(res,user)

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Login Successfull",
        data: user
    })
})

const RefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const tokenInfo = await AuthServices.generateRefreshToken(refreshToken as string);

    setCookiesAccessTokenwithRefreshToken(res, tokenInfo);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Login Successfull",
        data: tokenInfo
    });
});


export const AuthController = {
    LoginUser,
    RefreshToken
}