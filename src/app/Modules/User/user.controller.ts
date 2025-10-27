import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.services";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// user create function
const CreateUser = catchAsync (async(req:Request , res:Response, next:NextFunction) =>{
        
  const user = await UserServices.Createuser(req.body)

        Sendresponse(res,{
            success : true,
            statuscode : httpStatus.CREATED,
            message : "User Created Successfull",
            data : user
        })
}
)
// user Update function
const UpdateUser = catchAsync (async(req:Request , res:Response, next:NextFunction) =>{

        const UserId = req.params.id
        const payload = req.body
        const VerifyToken = req.user

  const user = UserServices.UpdateUser(UserId, payload, VerifyToken as JwtPayload)

        Sendresponse(res,{
            success : true,
            statuscode : httpStatus.OK,
            message : "User Update Successfull",
            data : user
        })
}
)

// user get function
const AllUser = catchAsync( async (req:Request , res:Response,next:NextFunction) => {

         const result = await UserServices.AllUser()
         
          Sendresponse(res,{
            success : true,
            statuscode : httpStatus.OK,
            message : "All user get Successfull",
            data : result.data,
            meta : result.meta

            })
})
const GetMyProfile = catchAsync( async (req:Request , res:Response,next:NextFunction) => {

        const decodedToken = req.user as JwtPayload;


         const result = await UserServices.GetMyProfile(decodedToken)
         
          Sendresponse(res,{
            success : true,
            statuscode : httpStatus.OK,
            message : "Your profile fetched successfully",
            data : result.data,

            })
})

export const  UserController = {
        CreateUser , AllUser , UpdateUser , GetMyProfile
}

