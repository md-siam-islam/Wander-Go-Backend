import { Cancel } from './../../../../node_modules/axios/index.d';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { PaymentServices } from "./payment.services";
import { envVariables } from "../../config/env";

const successPayment = catchAsync(async (req:Request , res:Response, next:NextFunction) => {

    const query = req.query

    const result = await PaymentServices.successPayment(query as Record<string ,string >)

    if(result.success){
        res.redirect(`${envVariables.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
    }
   
})


const faildPayment = catchAsync (async (req:Request , res:Response, next:NextFunction) => {

    const query = req.query 

    const result = await PaymentServices.failedPayment(query as Record<string, string>)

    if(!result.success){
        res.redirect(`${envVariables.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
    }
})
const cancelPayment = catchAsync (async (req:Request , res:Response, next:NextFunction) => {

    const query = req.query 

    const result = await PaymentServices.cancelPayment(query as Record<string, string>)

    if(!result.success){
        res.redirect(`${envVariables.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
    }
})



export const PaymentController = {
    successPayment,
    faildPayment,
    cancelPayment
}