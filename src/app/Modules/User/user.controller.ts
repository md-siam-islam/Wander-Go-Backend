import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.services";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";





// user create function
const CreateUser = catchAsync (async(req:Request , res:Response, next:NextFunction) =>{
        
  const user = UserServices.Createuser(req.body)

        Sendresponse(res,{
            success : true,
            statuscode : httpStatus.CREATED,
            message : "User Created Successfull",
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

export const  UserController = {
        CreateUser , AllUser
}