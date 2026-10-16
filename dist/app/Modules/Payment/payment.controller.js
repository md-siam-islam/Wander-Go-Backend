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
    const bookingId = req.params.bookingId;
    const result = yield payment_services_1.PaymentServices.initPayment(bookingId);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Booking payment Successfully",
        data: result
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const body = req.body;
    const result = yield payment_services_1.PaymentServices.successPayment(query, body);
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id) || "";
    const amount = query.amount || (body === null || body === void 0 ? void 0 : body.amount) || "";
    const status = query.status || (body === null || body === void 0 ? void 0 : body.status) || "success";
    if (result.success) {
        res.redirect(`${env_1.envVariables.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${transactionId}&amount=${amount}&status=${status}`);
    }
}));
const faildPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const body = req.body;
    const result = yield payment_services_1.PaymentServices.failedPayment(query, body);
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id) || "";
    const amount = query.amount || (body === null || body === void 0 ? void 0 : body.amount) || "";
    const status = query.status || (body === null || body === void 0 ? void 0 : body.status) || "fail";
    if (!result.success) {
        res.redirect(`${env_1.envVariables.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${transactionId}&amount=${amount}&status=${status}`);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const body = req.body;
    const result = yield payment_services_1.PaymentServices.cancelPayment(query, body);
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id) || "";
    const amount = query.amount || (body === null || body === void 0 ? void 0 : body.amount) || "";
    const status = query.status || (body === null || body === void 0 ? void 0 : body.status) || "cancel";
    if (!result.success) {
        res.redirect(`${env_1.envVariables.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${transactionId}&amount=${amount}&status=${status}`);
    }
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
