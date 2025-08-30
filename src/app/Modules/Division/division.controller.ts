import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { DivisionServices } from "./division.services";
import { Sendresponse } from "../utils/sendResponse";


const createDivision = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const create = await DivisionServices.CreateDivision(req.body)

     Sendresponse(res,{
            success : true,
            statuscode : httpStatus.CREATED,
            message : "Division Created Successfully",
            data : create
        })
})


 export const DivisionController = {
    createDivision
}