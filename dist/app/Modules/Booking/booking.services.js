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
exports.BookingServices = void 0;
const payment_interface_1 = require("../Payment/payment.interface");
const payment_model_1 = require("../Payment/payment.model");
const ssl_services_1 = require("../sslCommerz/ssl.services");
const tour_model_1 = require("../Tour/tour.model");
const user_model_1 = require("../User/user.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransactionId();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new Error("user not Found . Error BY Booking Servces");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!tour) {
            throw new Error("Tour not found");
        }
        if (!tour.costFrom) {
            throw new Error("costFrom Not found Place costFrom provide Koren");
        }
        const TotalAmount = Number(tour.costFrom) * Number(payload.guestCount);
        const booking = yield booking_model_1.Booking.create([Object.assign({ user: userId, BookingStatus: booking_interface_1.BOOKING_ENUM.PENDING }, payload)], { session });
        const payment = yield payment_model_1.Payment.create([{
                booking: booking[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: TotalAmount
            }], { session });
        const UpdatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session }).populate("user", "name email phone address").populate("tour", "title costFrom").populate("payment");
        const Name = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).name;
        const Email = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).email;
        const Phone = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).phone;
        const Addres = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).address;
        const sslArgument = {
            amount: TotalAmount,
            transactionId: transactionId,
            name: Name,
            email: Email,
            phone: Phone,
            address: Addres
        };
        const sslPaymentGetway = yield ssl_services_1.SSLservices.sslPayment(sslArgument);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPaymentGetway.GatewayPageURL,
            BookingDetails: UpdatedBooking
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllbooking = () => __awaiter(void 0, void 0, void 0, function* () {
    const allBooking = yield booking_model_1.Booking.find().populate("user", "name email phone address").populate("tour", "title costFrom").populate("payment");
    return allBooking;
});
const getsinglebooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const singleBooking = yield booking_model_1.Booking.findById(bookingId).populate("user", "name email phone address").populate("tour", "title costFrom").populate("payment");
    return singleBooking;
});
const getMybooking = (decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const Mybooking = yield booking_model_1.Booking.find({ user: decodedUser.userId });
    return Mybooking;
});
exports.BookingServices = {
    createBooking,
    getAllbooking,
    getsinglebooking,
    getMybooking
};
