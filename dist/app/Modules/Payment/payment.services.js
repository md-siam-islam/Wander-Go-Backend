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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const booking_interface_1 = require("../Booking/booking.interface");
const booking_model_1 = require("../Booking/booking.model");
const ssl_services_1 = require("../sslCommerz/ssl.services");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new Error("Booking not found , place again make booking for tour");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking)
        .populate("user");
    const Name = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const Email = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const Phone = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const Addres = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const sslArgument = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: Name,
        email: Email,
        phone: Phone,
        address: Addres
    };
    const sslPaymentGetway = yield ssl_services_1.SSLservices.sslPayment(sslArgument);
    return {
        paymentUrl: sslPaymentGetway.GatewayPageURL
    };
});
const successPayment = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id);
        if (!transactionId) {
            throw new Error("Transaction ID is missing");
        }
        const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
            paymentGatewayData: body || query
        }, { session, new: true });
        if (!Updatedpayment) {
            throw new Error("Payment record not found for transaction: " + transactionId);
        }
        yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.COMPLETE }, { new: true, runValidators: true, session }).populate("user", "name email phone address").populate("tour", "title costFrom").populate("payment");
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true, message: "Payment successful"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failedPayment = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id);
        const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED,
            paymentGatewayData: body || query
        }, { session, new: true });
        if (Updatedpayment) {
            yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.FAILED }, { runValidators: true, session });
        }
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false, message: "Payment failed"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id);
        const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCEL,
            paymentGatewayData: body || query
        }, { session, new: true });
        if (Updatedpayment) {
            yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.CANCEL }, { runValidators: true, session });
        }
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false, message: "Payment cancelled"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.PaymentServices = {
    successPayment,
    failedPayment,
    cancelPayment,
    initPayment
};
