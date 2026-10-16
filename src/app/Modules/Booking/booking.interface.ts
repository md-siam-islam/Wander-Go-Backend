import { Types } from "mongoose";


export enum BOOKING_ENUM {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED",
    // Backward compatibility aliases
    CANCLE = "CANCEL",
    CPMPLATE = "COMPLETE"
}

export interface IBooking {
    user : Types.ObjectId,
    tour : Types.ObjectId,
    payment? : Types.ObjectId,
    guestCount : number,
    status : BOOKING_ENUM
}