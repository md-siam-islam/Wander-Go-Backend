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
        data: {
            bookingDetails: Booking.BookingDetails,
            paymentUrl: Booking.paymentUrl || "Payment URL not found"
        }
    })
})

const getAllbooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {

        const result = await BookingServices.getAllbooking(req.query as Record<string, string>)

        Sendresponse(res,{
            success : true,
            statuscode : httpStatus.OK,
            message : "All Booking Get Successfully",
            data : result.data,
            meta : result.meta
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


const getMybooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {

            const decodedUser = req.user

            const result = await BookingServices.getMybooking(decodedUser as JwtPayload)

             Sendresponse(res,{
                success : true,
                statuscode : httpStatus.OK,
                message : "My Booking Get Successfully",
                data : result
            })

})


const cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const decodedUser = req.user as JwtPayload;

    const result = await BookingServices.cancelBookingByUser(bookingId, decodedUser.userId);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Booking cancelled successfully",
        data: result,
    });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    const result = await BookingServices.updateBookingStatusByAdmin(bookingId, status);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Booking status updated successfully",
        data: result,
    });
});

const deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;

    await BookingServices.deleteBooking(bookingId);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Booking deleted successfully",
        data: null,
    });
});

export const BookingController = {
    CreateBooking,
    getAllbooking,
    getsinglebooking,
    getMybooking,
    cancelBooking,
    updateBookingStatus,
    deleteBooking
}