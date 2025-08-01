import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../app/Modules/utils/jwt";

export const checkAuth =(...role : string[]) => async(req:Request , res:Response, next:NextFunction) =>{
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new Error("No token provided");
        }

        const verify = verifyToken(accessToken , "secret") as JwtPayload;
        
        if(!role.includes(verify.role)) {
            throw new Error("You are not authorized to access this resource");
        }
        
        req.user = verify
        next();

    } catch (error) {
        next(error);
    }
}