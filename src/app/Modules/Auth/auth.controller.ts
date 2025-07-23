import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AuthServices } from "./auth.services"
import { Sendresponse } from "../utils/sendResponse"
import httpStatus from "http-status-codes"


const LoginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.CredentialLogin(req.body)

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Login Successfull",
        data: user
    })
})

export const AuthController = {
    LoginUser
}