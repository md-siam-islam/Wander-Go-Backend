import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../app/Modules/utils/jwt";
import { envVariables } from "../app/config/env";
import { User } from "../app/Modules/User/user.model";
import { IsActive } from "../app/Modules/User/user.interface";

export const checkAuth =(...role : string[]) => async(req:Request , res:Response, next:NextFunction) =>{
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new Error("No token provided from checkAuth");
        }

        const verify = verifyToken(accessToken , envVariables.JWT_SECRET) as JwtPayload;

         const isUser = await User.findOne({ email : verify.email });

            if (!isUser) {
                throw new Error("User not found from checkAuth");
            }
        
            if(isUser.isActive === IsActive.BLOCKED) {
                throw new Error("User is not active from checkAuth 1");
            }
            if(isUser.isActive === IsActive.INACTIVE) {
                throw new Error("User is not active from checkAuth 2");
            }
            if(isUser.isDeleted){
                throw new Error("User is not active from checkAuth 3");
            }

        if(!role.includes(verify.role)) {
            throw new Error("You are not authorized to access this resource");
        }
        
        req.user = verify
        next();

    } catch (error) {
        next(error);
    }
}