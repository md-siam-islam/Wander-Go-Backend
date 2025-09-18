import { BOOKING_ENUM } from "../Booking/booking.interface"
import { Booking } from "../Booking/booking.model"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"


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
    cancelPayment
}