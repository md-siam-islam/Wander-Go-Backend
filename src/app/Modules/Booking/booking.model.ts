import { model, Schema } from 'mongoose';
import { BOOKING_ENUM, IBooking } from './booking.interface';


const bookingSchema = new Schema<IBooking>({

    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    tour : {
        type : Schema.Types.ObjectId,
        ref : "Tour",
        required : true
    },
    payment : {
        type : Schema.Types.ObjectId,
        ref : "Payment",
    },
    guestCount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : Object.values(BOOKING_ENUM),
        default : BOOKING_ENUM.PENDING
    },
    couponCode: {
        type: String,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    originalAmount: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    }

} , {
    timestamps : true
})


export const Booking = model<IBooking>("Booking" , bookingSchema)