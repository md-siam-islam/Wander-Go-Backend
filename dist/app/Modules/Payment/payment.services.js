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
exports.PaymentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_interface_1 = require("../Booking/booking.interface");
const booking_model_1 = require("../Booking/booking.model");
const ssl_services_1 = require("../sslCommerz/ssl.services");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!bookingId) {
        throw new Error("Booking ID is required");
    }
    let payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment && mongoose_1.default.Types.ObjectId.isValid(bookingId)) {
        payment = yield payment_model_1.Payment.findById(bookingId);
    }
    if (!payment) {
        throw new Error("Booking payment record not found. Please create a new booking.");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking).populate("user");
    if (!booking) {
        throw new Error("Associated booking not found.");
    }
    const userObj = booking.user;
    const Name = (userObj === null || userObj === void 0 ? void 0 : userObj.name) || "Customer";
    const Email = (userObj === null || userObj === void 0 ? void 0 : userObj.email) || "customer@wandergo.com";
    const Phone = (userObj === null || userObj === void 0 ? void 0 : userObj.phone) || "01700000000";
    const Addres = (userObj === null || userObj === void 0 ? void 0 : userObj.address) || "Dhaka, Bangladesh";
    const sslArgument = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: Name,
        email: Email,
        phone: Phone,
        address: Addres
    };
    const sslPaymentGetway = yield ssl_services_1.SSLservices.sslPayment(sslArgument);
    const paymentUrl = (sslPaymentGetway === null || sslPaymentGetway === void 0 ? void 0 : sslPaymentGetway.GatewayPageURL) || (sslPaymentGetway === null || sslPaymentGetway === void 0 ? void 0 : sslPaymentGetway.redirectGatewayURL);
    if (!paymentUrl) {
        const errorReason = (sslPaymentGetway === null || sslPaymentGetway === void 0 ? void 0 : sslPaymentGetway.failedreason) || (sslPaymentGetway === null || sslPaymentGetway === void 0 ? void 0 : sslPaymentGetway.message) || (sslPaymentGetway === null || sslPaymentGetway === void 0 ? void 0 : sslPaymentGetway.status) || "Payment gateway URL generation failed";
        throw new Error(`SSLCommerz payment gateway error: ${errorReason}`);
    }
    return {
        paymentUrl,
        sslStatus: sslPaymentGetway === null || sslPaymentGetway === void 0 ? void 0 : sslPaymentGetway.status
    };
});
const successPayment = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id);
    if (!transactionId) {
        throw new Error("Transaction ID is missing");
    }
    // Try transactional update if replica set is available
    try {
        const session = yield booking_model_1.Booking.startSession();
        session.startTransaction();
        try {
            const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
                status: payment_interface_1.PAYMENT_STATUS.PAID,
                paymentGatewayData: body || query
            }, { session, new: true });
            if (Updatedpayment) {
                yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.COMPLETE }, { new: true, runValidators: true, session });
            }
            yield session.commitTransaction();
            session.endSession();
            return { success: true, message: "Payment successful" };
        }
        catch (txErr) {
            yield session.abortTransaction();
            session.endSession();
            // If error is not replica set error, rethrow
            if (!((_a = txErr === null || txErr === void 0 ? void 0 : txErr.message) === null || _a === void 0 ? void 0 : _a.includes("replica set"))) {
                throw txErr;
            }
        }
    }
    catch (sessionErr) {
        // Fall back to direct atomic updates for standalone MongoDB
    }
    // Direct atomic update
    const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
        status: payment_interface_1.PAYMENT_STATUS.PAID,
        paymentGatewayData: body || query
    }, { new: true });
    if (!Updatedpayment) {
        throw new Error("Payment record not found for transaction: " + transactionId);
    }
    yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.COMPLETE }, { new: true, runValidators: true });
    return { success: true, message: "Payment successful" };
});
const failedPayment = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id);
    if (!transactionId)
        return { success: false, message: "No transaction ID" };
    const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
        status: payment_interface_1.PAYMENT_STATUS.FAILED,
        paymentGatewayData: body || query
    }, { new: true });
    if (Updatedpayment) {
        yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.FAILED }, { runValidators: true });
    }
    return { success: false, message: "Payment failed" };
});
const cancelPayment = (query, body) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = query.transactionId || (body === null || body === void 0 ? void 0 : body.tran_id);
    if (!transactionId)
        return { success: false, message: "No transaction ID" };
    const Updatedpayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
        status: payment_interface_1.PAYMENT_STATUS.CANCEL,
        paymentGatewayData: body || query
    }, { new: true });
    if (Updatedpayment) {
        yield booking_model_1.Booking.findByIdAndUpdate(Updatedpayment.booking, { status: booking_interface_1.BOOKING_ENUM.CANCEL }, { runValidators: true });
    }
    return { success: false, message: "Payment cancelled" };
});
const QueryBulder_1 = require("../utils/QueryBulder");
const getAllPayments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentSearchFields = ["transactionId"];
    const modelQuery = new QueryBulder_1.QueryBuilder(payment_model_1.Payment.find()
        .populate({
        path: "booking",
        populate: [
            { path: "user", select: "name email phone picture" },
            { path: "tour", select: "title costFrom images location" }
        ]
    }), query);
    const payments = yield modelQuery
        .search(paymentSearchFields)
        .filter()
        .sort()
        .field()
        .pagination();
    const [data, meta] = yield Promise.all([
        payments.build(),
        modelQuery.Getmeta()
    ]);
    return {
        data,
        meta
    };
});
const getSinglePayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(id)
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
});
exports.PaymentServices = {
    successPayment,
    failedPayment,
    cancelPayment,
    initPayment,
    getAllPayments,
    getSinglePayment
};
