import { Request, Response } from "express";
import httpStatus from "http-status-codes"

export const routnotfound = (req:Request , res: Response) => {

    res.status(httpStatus.NOT_FOUND).json({
        success : false, 
        message : " Rout Not Found"
    })

}