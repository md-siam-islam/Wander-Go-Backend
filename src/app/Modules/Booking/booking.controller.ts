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


export const  BookingController = {
    CreateBooking
}