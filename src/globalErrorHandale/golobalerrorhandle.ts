import { NextFunction, Request, Response } from "express";

export const globalErrorHandle = ( error : any, req:Request , res: Response , next: NextFunction) => {

    console.log(error)

    if(error.code === 11000){
        console.log("Dublicate Key Error" , error.message);
        const Dublicate = error.message.match(/”([^”]*)”/);
        console.log(Dublicate);
        const message = `Dublicate value entered for ${Dublicate?.[1]} field, please choose another value`
        return res.status(400).json({
            success: false,
            message,
            error: error.keyValue,
        })
    }



      // Custom error (service থেকে throw করা হয়েছে)
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success : false,
        message : `Somthing went wrong !!! 😒😒 ${error.message} . Error Form Global Erroe`,
        error
    })
}