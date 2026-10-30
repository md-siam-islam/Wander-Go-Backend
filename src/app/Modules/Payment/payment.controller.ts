import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { PaymentServices } from "./payment.services";
import { envVariables } from "../../config/env";
import { Sendresponse } from "../utils/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId || req.body.bookingId;
    const result = await PaymentServices.initPayment(bookingId as string);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Booking payment initialized successfully",
        data: result
    });
});

const successPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const body = req.body || {};

    const transactionId = query.transactionId || body?.tran_id || "";
    const amount = query.amount || body?.amount || "";
    const status = query.status || body?.status || "success";

    let frontendSuccessUrl = (envVariables.SSL.SSL_SUCCESS_FRONTEND_URL || "http://localhost:5173/payment/success").trim();
    let frontendFailUrl = (envVariables.SSL.SSL_FAIL_FRONTEND_URL || "http://localhost:5173/payment/fail").trim();
    if (frontendSuccessUrl.includes(":3000")) frontendSuccessUrl = frontendSuccessUrl.replace(":3000", ":5173");
    if (frontendFailUrl.includes(":3000")) frontendFailUrl = frontendFailUrl.replace(":3000", ":5173");

    try {
        const result = await PaymentServices.successPayment(query, body);
        return res.redirect(`${frontendSuccessUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=success`);
    } catch (err: any) {
        console.error("Payment success processing error:", err?.message || err);
        return res.redirect(`${frontendFailUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=fail&error=${encodeURIComponent(err?.message || "Payment verification failed")}`);
    }
});

const faildPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const body = req.body || {};

    const transactionId = query.transactionId || body?.tran_id || "";
    const amount = query.amount || body?.amount || "";
    const status = query.status || body?.status || "fail";
    const errorMsg = body?.error || body?.failedreason || query?.error || "Payment was declined by payment gateway or bank.";

    try {
        await PaymentServices.failedPayment(query, body);
    } catch (err: any) {
        console.error("Payment failed recording error:", err?.message || err);
    }

    let frontendFailUrl = (envVariables.SSL.SSL_FAIL_FRONTEND_URL || "http://localhost:5173/payment/fail").trim();
    if (frontendFailUrl.includes(":3000")) frontendFailUrl = frontendFailUrl.replace(":3000", ":5173");
    return res.redirect(`${frontendFailUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=fail&error=${encodeURIComponent(errorMsg)}`);
});

const cancelPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const body = req.body || {};

    const transactionId = query.transactionId || body?.tran_id || "";
    const amount = query.amount || body?.amount || "";
    const status = query.status || body?.status || "cancel";

    try {
        await PaymentServices.cancelPayment(query, body);
    } catch (err: any) {
        console.error("Payment cancel recording error:", err?.message || err);
    }

    let frontendCancelUrl = (envVariables.SSL.SSL_CANCEL_FRONTEND_URL || "http://localhost:5173/payment/cancel").trim();
    if (frontendCancelUrl.includes(":3000")) frontendCancelUrl = frontendCancelUrl.replace(":3000", ":5173");
    return res.redirect(`${frontendCancelUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=cancel`);
});

const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentServices.getAllPayments(req.query as Record<string, string>);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Payments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await PaymentServices.getSinglePayment(id);

    Sendresponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Payment details retrieved successfully",
        data: result,
    });
});

export const PaymentController = {
    successPayment,
    faildPayment,
    cancelPayment,
    initPayment,
    getAllPayments,
    getSinglePayment
};
