import {  JwtPayload } from 'jsonwebtoken';
import httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Sendresponse } from "../utils/sendResponse";
import { BookingServices } from './booking.services';


const CreateBooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {

    const DecodedUser = req.user as JwtPayload
    
    const Booking = await BookingServices.createBooking(req.body , DecodedUser.userId)

     Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "Booking Created Successfully",
        data :  Booking
    })
})

const getAllbooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {

        const result = await BookingServices.getAllbooking()

         Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "All Booking Get Successfully",
        data : result
    })

})
const getsinglebooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {

        const {bookingId} = req.params

        const result = await BookingServices.getsinglebooking(bookingId as string)

         Sendresponse(res,{
        success : true,
        statuscode : httpStatus.OK,
        message : "All Booking Get Successfully",
        data : result
    })

})


export const  BookingController = {
    CreateBooking,
    getAllbooking,
    getsinglebooking
}