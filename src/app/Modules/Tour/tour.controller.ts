import  httpStatus  from 'http-status-codes';
import { Request , Response ,NextFunction} from "express";
import { catchAsync } from "../utils/catchAsync";
import { TourServices } from "./tour.services";
import { Sendresponse } from "../utils/sendResponse";


const TourtypeCreate = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const TourType = await TourServices.CreateTourtype(req.body)

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

const UpdateTourtype = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const {id} = req.params

    const payload = req.body

    const Tourtype = await TourServices.UpdateTourtype(id , payload)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Updated Successfully",
        data : Tourtype
    })
})

const DeleteTourtype = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const {id} = req.params

    await TourServices.DeleteTourtype(id)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Deleted Successfully",
        data : null
    })
})

// tour type controller end //

// tour controller start //

const TourCreate = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const Tour = await TourServices.CreateTour(req.body)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Created Successfully",
        data : Tour
    })
})

const getAlltour = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const Tour = await TourServices.getAllTour()
    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "All Tours Retrieved Successfully",
        data : Tour
    })
})

const GetSingleTour = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const {id} = req.params

    const Tour = await TourServices.GetSingleTour(id)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Retrieved Successfully",
        data : Tour
    })
})

const UpdateTour = catchAsync(async (req:Request , res:Response, next:NextFunction) => {
    const {id} = req.params

    const payload = req.body

    const Tour = await TourServices.UpdateTour(id , payload)

    Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Tour Updated Successfully",
        data : Tour
    })
})

export const TourController = {
    TourtypeCreate,
    getAllTourtype,
    getAlltour,
    GetSingleTourtype,
    GetSingleTour,
    TourCreate,
    UpdateTourtype,
    UpdateTour,
    DeleteTourtype
}