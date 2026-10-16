import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    FAILED = "FAILED",
    CANCEL = "CANCEL",
    REFUNDED = "REFUNDED",
    // Backward compatibility alias
    CANCLE = "CANCEL"
}
export interface IPayment {
    booking : Types.ObjectId,
    transactionId :string,
    amount : number ,
    paymentGatewayData?: any,
    invoiceUrl?: string,
    status : PAYMENT_STATUS

}