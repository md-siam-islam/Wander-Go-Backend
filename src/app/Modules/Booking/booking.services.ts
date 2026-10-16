
import { JwtPayload } from "jsonwebtoken";
import { PAYMENT_STATUS } from "../Payment/payment.interface";
import { Payment } from "../Payment/payment.model";
import { SSLservices } from "../sslCommerz/ssl.services";
import { SSLcommrez } from "../sslCommerz/sslCommerz.interface";
import { Tour } from "../Tour/tour.model";
import { User } from "../User/user.model";
import { BOOKING_ENUM, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`;
};

const createBooking = async (payload:Partial<IBooking> , userId : string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    
    session.startTransaction()

    try {
    const user = await User.findById(userId)

    if(!user){
        throw new Error("User not found")
    }

    if(!user.phone || !user.address){
        throw new Error("Please update your profile to provide your phone number and address before booking")
    }

    const tour = await Tour.findById(payload.tour).select("title costFrom maxGests maxGuests")
    
    if (!tour) {
        throw new Error("Tour not found");
    }

    if(!tour.costFrom){
        throw new Error("Tour cost is not available");
    }

    const guestCount = Number(payload.guestCount) || 1;
    const maxCapacity = (tour as any).maxGuests || (tour as any).maxGests || 0;

    // Check seat availability
    if (maxCapacity > 0) {
        const existingBookings = await Booking.aggregate([
            {
                $match: {
                    tour: tour._id,
                    status: { $in: [BOOKING_ENUM.PENDING, BOOKING_ENUM.COMPLETE] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBooked: { $sum: "$guestCount" }
                }
            }
        ]);
        const alreadyBooked = existingBookings[0]?.totalBooked || 0;
        if (alreadyBooked + guestCount > maxCapacity) {
            const availableSeats = Math.max(0, maxCapacity - alreadyBooked);
            throw new Error(`Only ${availableSeats} seat(s) available for this tour. You requested ${guestCount}.`);
        }
    }

    const TotalAmount = Number(tour.costFrom) * guestCount

    const booking = await Booking.create([{
        user : userId,
        tour : payload.tour,
        guestCount : guestCount,
        status : BOOKING_ENUM.PENDING
    }],{session})

    const payment = await Payment.create([{
        booking : booking[0]._id,
        status : PAYMENT_STATUS.UNPAID,
        transactionId : transactionId,
        amount : TotalAmount
    }] ,{session})

    const UpdatedBooking = await Booking.findByIdAndUpdate(booking[0]._id , {payment : payment[0]._id} , {new : true , runValidators : true, session}).populate("user" , "name email phone address").populate("tour" , "title costFrom images location").populate("payment")
    
    const Name = (UpdatedBooking?.user as any).name
    const Email = (UpdatedBooking?.user as any).email
    const Phone = (UpdatedBooking?.user as any).phone
    const Addres = (UpdatedBooking?.user as any).address

    const sslArgument: SSLcommrez = {
        amount : TotalAmount,
        transactionId : transactionId,
        name : Name, 
        email: Email,
        phone : Phone,
        address: Addres
    }

    const sslPaymentGetway = await SSLservices.sslPayment(sslArgument)
    
    await session.commitTransaction()
    session.endSession()

    return {
        paymentUrl : sslPaymentGetway.GatewayPageURL,
        BookingDetails : UpdatedBooking
    }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
    
}



const getAllbooking = async () => {

    const allBooking = await Booking.find().populate("user" , "name email phone address").populate("tour" , "title costFrom images location").populate("payment")
    return allBooking
}
const getsinglebooking = async (bookingId : string) => {

    const singleBooking = await Booking.findById(bookingId).populate("user" , "name email phone address").populate("tour" , "title costFrom images location").populate("payment")

    return singleBooking
}

const getMybooking = async (decodedUser : JwtPayload) => {

    const Mybooking = await Booking.find({user : decodedUser.userId}).populate("tour" , "title costFrom images location startDate endDate").populate("payment")

    return Mybooking
}


 export const BookingServices = {
        createBooking,
        getAllbooking,
        getsinglebooking,
        getMybooking
}