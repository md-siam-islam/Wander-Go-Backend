"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../utils/catchAsync");
const payment_services_1 = require("./payment.services");
const env_1 = require("../../config/env");
const sendResponse_1 = require("../utils/sendResponse");
const initPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId || req.body.bookingId;
    const result = yield payment_services_1.PaymentServices.initPayment(bookingId);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Booking payment initialized successfully",
        data: result
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const body = req.body || {};
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id) || "";
    const amount = query.amount || (body === null || body === void 0 ? void 0 : body.amount) || "";
    const status = query.status || (body === null || body === void 0 ? void 0 : body.status) || "success";
    let frontendSuccessUrl = (env_1.envVariables.SSL.SSL_SUCCESS_FRONTEND_URL || "http://localhost:5173/payment/success").trim();
    let frontendFailUrl = (env_1.envVariables.SSL.SSL_FAIL_FRONTEND_URL || "http://localhost:5173/payment/fail").trim();
    if (frontendSuccessUrl.includes(":3000"))
        frontendSuccessUrl = frontendSuccessUrl.replace(":3000", ":5173");
    if (frontendFailUrl.includes(":3000"))
        frontendFailUrl = frontendFailUrl.replace(":3000", ":5173");
    try {
        const result = yield payment_services_1.PaymentServices.successPayment(query, body);
        return res.redirect(`${frontendSuccessUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=success`);
    }
    catch (err) {
        console.error("Payment success processing error:", (err === null || err === void 0 ? void 0 : err.message) || err);
        return res.redirect(`${frontendFailUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=fail&error=${encodeURIComponent((err === null || err === void 0 ? void 0 : err.message) || "Payment verification failed")}`);
    }
}));
const faildPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const body = req.body || {};
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id) || "";
    const amount = query.amount || (body === null || body === void 0 ? void 0 : body.amount) || "";
    const status = query.status || (body === null || body === void 0 ? void 0 : body.status) || "fail";
    const errorMsg = (body === null || body === void 0 ? void 0 : body.error) || (body === null || body === void 0 ? void 0 : body.failedreason) || (query === null || query === void 0 ? void 0 : query.error) || "Payment was declined by payment gateway or bank.";
    try {
        yield payment_services_1.PaymentServices.failedPayment(query, body);
    }
    catch (err) {
        console.error("Payment failed recording error:", (err === null || err === void 0 ? void 0 : err.message) || err);
    }
    let frontendFailUrl = (env_1.envVariables.SSL.SSL_FAIL_FRONTEND_URL || "http://localhost:5173/payment/fail").trim();
    if (frontendFailUrl.includes(":3000"))
        frontendFailUrl = frontendFailUrl.replace(":3000", ":5173");
    return res.redirect(`${frontendFailUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=fail&error=${encodeURIComponent(errorMsg)}`);
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const body = req.body || {};
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id) || "";
    const amount = query.amount || (body === null || body === void 0 ? void 0 : body.amount) || "";
    const status = query.status || (body === null || body === void 0 ? void 0 : body.status) || "cancel";
    try {
        yield payment_services_1.PaymentServices.cancelPayment(query, body);
    }
    catch (err) {
        console.error("Payment cancel recording error:", (err === null || err === void 0 ? void 0 : err.message) || err);
    }
    let frontendCancelUrl = (env_1.envVariables.SSL.SSL_CANCEL_FRONTEND_URL || "http://localhost:5173/payment/cancel").trim();
    if (frontendCancelUrl.includes(":3000"))
        frontendCancelUrl = frontendCancelUrl.replace(":3000", ":5173");
    return res.redirect(`${frontendCancelUrl}?transactionId=${encodeURIComponent(transactionId)}&amount=${encodeURIComponent(amount)}&status=cancel`);
}));
const getAllPayments = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.PaymentServices.getAllPayments(req.query);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Payments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSinglePayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payment_services_1.PaymentServices.getSinglePayment(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Payment details retrieved successfully",
        data: result,
    });
}));
exports.PaymentController = {
    successPayment,
    faildPayment,
    cancelPayment,
    initPayment,
    getAllPayments,
    getSinglePayment
};
