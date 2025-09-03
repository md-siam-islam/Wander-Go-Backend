import { Types } from "mongoose";


export enum BOOKING_ENUM {
    PENDING = "PENDING",
    CANCLE = "CANCLE",
    CPMPLATE = "COMPLATE",
    FAILED = "FAILED"
}

export interface IBooking {
    user : Types.ObjectId,
    tour : Types.ObjectId,
    payment? : Types.ObjectId,
    guestCount : number,
    status : BOOKING_ENUM
}