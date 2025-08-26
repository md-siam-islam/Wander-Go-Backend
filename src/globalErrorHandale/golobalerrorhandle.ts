import { NextFunction, Request, Response } from "express";
import { envVariables } from "../app/config/env";

export const globalErrorHandle = ( error : any, req:Request , res: Response , next: NextFunction) => {

    if(envVariables.NODE_ENV === "development"){  
    console.log(error)
    }

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
    
    if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field "${error.path}": received "${error.value}"`,
      errorType: "CastError",
    });
  }
    
if (error.name === "ValidationError") {
  const errors = Object.values(error.errors).map((val: any) => ({
    field: val.path,
    message: val.message,
  }));

  return res.status(400).json({
    success: false,
    message: "Validation Error",
    errors,
  });
}

if(error.name === "ZodError"){
        const message = error.errors.map((err:any) => err.message).join(", ")
        console.log("Zod Validation Error" , message);
        return res.status(400).json({
            success: false,
            message,
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
        error : envVariables.NODE_ENV === "development" ? error : null,
        stack : envVariables.NODE_ENV === "development" ? error.stack : null,
    })
}