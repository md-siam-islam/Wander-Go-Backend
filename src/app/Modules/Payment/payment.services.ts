import { BOOKING_ENUM } from "../Booking/booking.interface"
import { Booking } from "../Booking/booking.model"
import { SSLservices } from "../sslCommerz/ssl.services"
import { SSLcommrez } from "../sslCommerz/sslCommerz.interface"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"


const initPayment = async (bookingId : string) => {

    const payment = await Payment.findOne({booking : bookingId})

    if(!payment){
        throw new Error ("Booking not found , place again make booking for tour")
    }

    const booking = await Booking.findById(payment.booking)

        const Name = (booking?.user as any).name
        const Email = (booking?.user as any).email
        const Phone = (booking?.user as any).phone
        const Addres = (booking?.user as any).address
    
        const sslArgument: SSLcommrez = {
            amount : payment.amount,
            transactionId : payment.transactionId,
            name : Name, 
            email: Email,
            phone : Phone,
            address: Addres
        }
    
        const sslPaymentGetway = await SSLservices.sslPayment(sslArgument)

        return {
             paymentUrl : sslPaymentGetway.GatewayPageURL
        }

}
const successPayment = async (query : Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        
        const Updatedpayment = await Payment.findOneAndUpdate({transactionId: query.transactionId },
            { status : PAYMENT_STATUS.PAID} ,{session})

            await Booking.findByIdAndUpdate(Updatedpayment?.booking,{status: BOOKING_ENUM.CPMPLATE},
            {new : true , runValidators : true, session}).populate("user" , "name email phone address",).populate("tour" , "title costFrom").populate("payment")
            
            await session.commitTransaction()
            session.endSession()

            return {
                success : true , message : "payment Successfull"
            }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

}

const failedPayment = async (query : Record<string, string>) =>{

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        
        const Updatedpayment = await Payment.findOneAndUpdate({transactionId: query.transactionId },
            { status : PAYMENT_STATUS.FAILED} ,{session})

            await Booking.findByIdAndUpdate(Updatedpayment?.booking,{status: BOOKING_ENUM.FAILED},
            {runValidators : true, session})
            
            await session.commitTransaction()
            session.endSession()

            return {
                success : false , message : "payment field"
            }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
const cancelPayment = async (query : Record<string, string>) =>{

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        
        const Updatedpayment = await Payment.findOneAndUpdate({transactionId: query.transactionId },
            { status : PAYMENT_STATUS.CANCLE} ,{session})

            await Booking.findByIdAndUpdate(Updatedpayment?.booking,{status: BOOKING_ENUM.CANCLE},
            {runValidators : true, session})
            
            await session.commitTransaction()
            session.endSession()

            return {
                success : false , message : "payment canclled"
            }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
export const PaymentServices = {
    successPayment,
    failedPayment,
    cancelPayment,
    initPayment
}