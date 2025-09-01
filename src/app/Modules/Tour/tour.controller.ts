import  httpStatus  from 'http-status-codes';
import { Request , Response ,NextFunction} from "express";
import { catchAsync } from "../utils/catchAsync";
import { TourServices } from "./tour.services";
import { Sendresponse } from "../utils/sendResponse";


const TourtypeCreate = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const TourType = await TourServices.CreateTour(req.body)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Created Successfully",
        data : TourType
    })
})

const getAllTourtype = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const TourType = await TourServices.getAllTourtype()

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "All Tours Retrieved Successfully",
        data : TourType
    })
})

const GetSingleTourtype = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const {id} = req.params

    const TourType = await TourServices.GetSingleTourtype(id)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Retrieved Successfully",
        data : TourType
    })
})


export const TourController = {
    TourtypeCreate,
    getAllTourtype,
    GetSingleTourtype
}