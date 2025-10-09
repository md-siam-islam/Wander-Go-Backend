import { NextFunction, Request, Response } from "express";
import { envVariables } from "../app/config/env";
import { deleteImageFromCloudinary } from "../app/config/cloudinary.config";

export const globalErrorHandle = async ( error : any, req:Request , res: Response , next: NextFunction) => {

    if(envVariables.NODE_ENV === "development"){  
    console.log(error)
    }

    // cloudenary error hole image delete korar funtion 

    if(req.file){
        await deleteImageFromCloudinary(req.file.path);
    }

    if(req.files && Array.isArray(req.files) && req.files.length > 0){

      await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
            await deleteImageFromCloudinary(file.path);
        })
    )};

    

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