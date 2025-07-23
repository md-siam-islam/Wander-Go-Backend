import { NextFunction, Request, Response } from "express";

export const globalErrorHandle = ( error : any, req:Request , res: Response , next: NextFunction) => {

    res.status(500).json({
        success : false,
        message : `Somthing went wrong !!! 😒😒 ${error.message} . Error Form Global Erroe`,
        error
    })
}