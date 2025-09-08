import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";


const paymentSchema = new Schema<IPayment>({
    booking : {
        type : Schema.Types.ObjectId,
        ref : "Booking",
        required : true,
    },
    transactionId : {
        type : String,
        required: true,
        default: () => `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        unique : true
    },
    amount : {
        type : Number,
        required : true,
    },
    paymentGatewayData : {
        type : Schema.Types.Mixed
    },
    invoiceUrl : {
        type : String
    },
    status : {
        type : String,
        enum : Object.values(PAYMENT_STATUS),
        default : PAYMENT_STATUS.UNPAID
    },

},{
    timestamps : true
})

export const Payment = model<IPayment>("Payment" , paymentSchema)