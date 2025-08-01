import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AuthServices } from "./auth.services"
import { Sendresponse } from "../utils/sendResponse"
import httpStatus from "http-status-codes"


const LoginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.CredentialLogin(req.body)

    res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    })
    // Set the refresh token in a cookie
    res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    })

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Login Successfull",
        data: user
    })
})
const RefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.headers.authorization
    const refreshToken = req.cookies.refreshToken
    const tokenInfo = await AuthServices.generateRefreshToken(refreshToken as string)

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Login Successfull",
        data: tokenInfo
    })
})

export const AuthController = {
    LoginUser,
    RefreshToken
}