
import { PAYMENT_STATUS } from "../Payment/payment.interface";
import { Payment } from "../Payment/payment.model";
import { Tour } from "../Tour/tour.model";
import { User } from "../User/user.model";
import { BOOKING_ENUM, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { randomUUID } from "crypto";

// const getTransactionId = () => {
//   return `tran_${Date.now()}_${randomUUID()}`;
// };

const createBooking = async (payload:Partial<IBooking> , userId : string) => {

    // const transactionId = getTransactionId()

    const user = await User.findById(userId)

    if(!user){
        throw new Error("user not Found . Error BY Booking Servces")
    }

    const tour =  await Tour.findById(payload.tour).select("costFrom")
    
    if (!tour) {
        throw new Error("Tour not found");
    }

    if(!tour.costFrom){
        throw new Error("costFrom Not found Place costFrom provide Koren")
    }

    const TotalAmount = Number(tour.costFrom) * Number(payload.guestCount)

    const booking =await Booking.create({
        user : userId,
        BookingStatus : BOOKING_ENUM.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking : booking._id,
        status : PAYMENT_STATUS.UNPAID,
        // TransactionId : transactionId,
        amount : TotalAmount
    })

    const UpdatedBooking = await Booking.findByIdAndUpdate(booking._id , {payment :  payment._id} , {new : true , runValidators : true})

    return UpdatedBooking
}

 export const BookingServices = {
        createBooking
}