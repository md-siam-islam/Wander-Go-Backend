import { JwtPayload } from 'jsonwebtoken';
import { User } from './../User/user.model';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AuthServices } from "./auth.services"
import { Sendresponse } from "../utils/sendResponse"
import httpStatus from "http-status-codes"
import { setCookiesAccessTokenwithRefreshToken } from "../utils/setCookies"
import { createToken } from '../utils/jwt';
import { envVariables } from '../../config/env';
import { JwtAccessToken } from '../utils/userAccessToken';
import passport from 'passport';


// const LoginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const user = await AuthServices.CredentialLogin(req.body)

//     setCookiesAccessTokenwithRefreshToken(res,user)

//     Sendresponse(res, {
//         success: true,
//         statuscode: httpStatus.OK,
//         message: "User Login Successfull",
//         data: user
//     })
// })

const LoginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const user = await AuthServices.CredentialLogin(req.body)
    passport.authenticate("local" , async (err:any , user:any , info:any ) => {


        if(err){
            return next(err);
        }

        if(!user){
            return next(new Error(info.message || "Authentication failed  38"));
        }

        const tokenInfo = JwtAccessToken(user);

        setCookiesAccessTokenwithRefreshToken(res,tokenInfo)

        const {password, ...userWithoutPassword} = user.toObject();

        Sendresponse(res, { 
        success: true,
        statuscode: httpStatus.OK,
        message: "User Login Successfull",
        accessToken: tokenInfo.accessToken,
        refreshToken: tokenInfo.refreshToken,
        data: userWithoutPassword
    })


    })(req,res,next)

    
})

const RefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const tokenInfo = await AuthServices.generateRefreshToken(refreshToken as string);

    setCookiesAccessTokenwithRefreshToken(res, tokenInfo);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "New access token retrieve Successfull",
        data: tokenInfo
    });
});

const LogoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Logout Successfull",
        data: null
    });
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedUser = req.user as JwtPayload;

    await AuthServices.changePassword(decodedUser, req.body);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

const ForgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      const email = req.body.email;

      if(!email){
        return next(new Error("Email is required"));
      }

     await AuthServices.ForgotPassword(email);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Email Sent Successfull",
        data: null
    });
});

const ResetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedUser = req.user;

    await AuthServices.UserResetPassword(req.body, decodedUser as JwtPayload);


    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User Reset Password Successfull",
        data: null
    });
});


const GoogleAuthCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     const user = req.user;

     console.log("Google Auth Callback User:", user);

     if(!user) {
        return next(new Error("User not found")); 
     }

     const tokenInfo = JwtAccessToken(user)
    setCookiesAccessTokenwithRefreshToken(res, tokenInfo);

    res.redirect(envVariables.FRONTEND_URL);


})


export const AuthController = {
    LoginUser,
    RefreshToken,
    LogoutUser,
    ResetPassword,
    GoogleAuthCallback,
    ForgotPassword,
    changePassword
}