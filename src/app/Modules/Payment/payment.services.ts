import { User } from "../User/user.model";
import mongoose from "mongoose";
import { BOOKING_ENUM } from "../Booking/booking.interface"
import { Booking } from "../Booking/booking.model"
import { SSLservices } from "../sslCommerz/ssl.services"
import { SSLcommrez } from "../sslCommerz/sslCommerz.interface"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"


const initPayment = async (bookingId: string) => {
    if (!bookingId) {
        throw new Error("Booking ID is required");
    }

    let payment = await Payment.findOne({ booking: bookingId });
    if (!payment && mongoose.Types.ObjectId.isValid(bookingId)) {
        payment = await Payment.findById(bookingId);
    }

    if (!payment) {
        throw new Error("Booking payment record not found. Please create a new booking.");
    }

    const booking = await Booking.findById(payment.booking).populate("user");
    if (!booking) {
        throw new Error("Associated booking not found.");
    }

    const userObj = booking.user as any;
    const Name = userObj?.name || "Customer";
    const Email = userObj?.email || "customer@wandergo.com";
    const Phone = userObj?.phone || "01700000000";
    const Addres = userObj?.address || "Dhaka, Bangladesh";

    const sslArgument: SSLcommrez = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: Name,
        email: Email,
        phone: Phone,
        address: Addres
    };

    const sslPaymentGetway = await SSLservices.sslPayment(sslArgument);

    const paymentUrl = sslPaymentGetway?.GatewayPageURL || sslPaymentGetway?.redirectGatewayURL;

    if (!paymentUrl) {
        const errorReason = sslPaymentGetway?.failedreason || sslPaymentGetway?.message || sslPaymentGetway?.status || "Payment gateway URL generation failed";
        throw new Error(`SSLCommerz payment gateway error: ${errorReason}`);
    }

    return {
        paymentUrl,
        sslStatus: sslPaymentGetway?.status
    };
}
const successPayment = async (query : Record<string, string>, body?: any) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const transactionId = query.transactionId || body?.tran_id;
        if (!transactionId) {
            throw new Error("Transaction ID is missing");
        }
        
        const Updatedpayment = await Payment.findOneAndUpdate(
            { transactionId },
            { 
                status : PAYMENT_STATUS.PAID,
                paymentGatewayData: body || query
            },
            { session, new: true }
        )

        if (!Updatedpayment) {
            throw new Error("Payment record not found for transaction: " + transactionId);
        }

        await Booking.findByIdAndUpdate(
            Updatedpayment.booking,
            { status: BOOKING_ENUM.COMPLETE },
            { new : true , runValidators : true, session }
        ).populate("user" , "name email phone address").populate("tour" , "title costFrom").populate("payment")
            
        await session.commitTransaction()
        session.endSession()

        return {
            success : true , message : "Payment successful"
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

}

const failedPayment = async (query : Record<string, string>, body?: any) =>{

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const transactionId = query.transactionId || body?.tran_id;
        
        const Updatedpayment = await Payment.findOneAndUpdate(
            { transactionId },
            { 
                status : PAYMENT_STATUS.FAILED,
                paymentGatewayData: body || query
            },
            { session, new: true }
        )

        if (Updatedpayment) {
            await Booking.findByIdAndUpdate(
                Updatedpayment.booking,
                { status: BOOKING_ENUM.FAILED },
                { runValidators : true, session }
            )
        }
            
        await session.commitTransaction()
        session.endSession()

        return {
            success : false , message : "Payment failed"
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
const cancelPayment = async (query : Record<string, string>, body?: any) =>{

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const transactionId = query.transactionId || body?.tran_id;
        
        const Updatedpayment = await Payment.findOneAndUpdate(
            { transactionId },
            { 
                status : PAYMENT_STATUS.CANCEL,
                paymentGatewayData: body || query
            },
            { session, new: true }
        )

        if (Updatedpayment) {
            await Booking.findByIdAndUpdate(
                Updatedpayment.booking,
                { status: BOOKING_ENUM.CANCEL },
                { runValidators : true, session }
            )
        }
            
        await session.commitTransaction()
        session.endSession()

        return {
            success : false , message : "Payment cancelled"
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
import { QueryBuilder } from "../utils/QueryBulder";

const getAllPayments = async (query: Record<string, string>) => {
    const paymentSearchFields = ["transactionId"];
    const modelQuery = new QueryBuilder(
        Payment.find()
            .populate({
                path: "booking",
                populate: [
                    { path: "user", select: "name email phone picture" },
                    { path: "tour", select: "title costFrom images location" }
                ]
            }),
        query
    );

    const payments = await modelQuery
        .search(paymentSearchFields)
        .filter()
        .sort()
        .field()
        .pagination();

    const [data, meta] = await Promise.all([
        payments.build(),
        modelQuery.Getmeta()
    ]);

    return {
        data,
        meta
    };
};

const getSinglePayment = async (id: string) => {
    const payment = await Payment.findById(id)
        .populate({
            path: "booking",
            populate: [
                { path: "user", select: "name email phone picture address" },
                { path: "tour", select: "title costFrom images location startDate endDate" }
            ]
        });

    if (!payment) {
        throw new Error("Payment record not found");
    }

    return payment;
};

export const PaymentServices = {
    successPayment,
    failedPayment,
    cancelPayment,
    initPayment,
    getAllPayments,
    getSinglePayment
}