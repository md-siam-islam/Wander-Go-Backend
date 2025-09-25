import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { DivisionServices } from "./division.services";
import { Sendresponse } from "../utils/sendResponse";
import { IDivision } from './division.interface';


const createDivision = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const payload : IDivision = {
        ...req.body,
        thumbnail : req.file?.path || ""
    }

    console.log(payload);

    const result = await DivisionServices.CreateDivision(payload)

    Sendresponse(res,{
            success : true,
            statuscode : httpStatus.CREATED,
            message : "Division Created Successfully",
            data : result
        })
})

const getAllDivision = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const query = req.query
    const getAll = await DivisionServices.GetAllDivision(query as Record< string, string>)

     Sendresponse(res,{
            success : true,
            statuscode : httpStatus.OK,
            message : "All Divisions Retrieved Successfully",
            data : getAll
        })
})

const updatedDivision = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const { id } = req.params;
    const payload = req.body;
    const updated = await DivisionServices.UpdatedDivision(id, payload);

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Division Updated Successfully",
        data : updated
    })
})


const getDivisionSingle = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const {slug} = req.params;

    const division = await DivisionServices.getSingleDivision(slug);

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Division Retrieved Successfully",
        data : division
    })
})


const DeleteDivision = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const {id} = req.params;
    await DivisionServices.DeleteDivision(id);

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Division Deleted Successfully",
        data : null
    })
})



 export const DivisionController = {
    createDivision,
    getAllDivision,
    updatedDivision,
    DeleteDivision,
    getDivisionSingle
}