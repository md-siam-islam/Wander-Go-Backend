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
const coupon_services_1 = require("../Coupon/coupon.services");
const coupon_model_1 = require("../Coupon/coupon.model");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transactionId = getTransactionId();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.phone || !user.address) {
            throw new Error("Please update your profile to provide your phone number and address before booking");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("title costFrom maxGests maxGuests");
        if (!tour) {
            throw new Error("Tour not found");
        }
        if (!tour.costFrom) {
            throw new Error("Tour cost is not available");
        }
        const guestCount = Number(payload.guestCount) || 1;
        const maxCapacity = tour.maxGuests || tour.maxGests || 0;
        // Check seat availability
        if (maxCapacity > 0) {
            const existingBookings = yield booking_model_1.Booking.aggregate([
                {
                    $match: {
                        tour: tour._id,
                        status: { $in: [booking_interface_1.BOOKING_ENUM.PENDING, booking_interface_1.BOOKING_ENUM.COMPLETE] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalBooked: { $sum: "$guestCount" }
                    }
                }
            ]);
            const alreadyBooked = ((_a = existingBookings[0]) === null || _a === void 0 ? void 0 : _a.totalBooked) || 0;
            if (alreadyBooked + guestCount > maxCapacity) {
                const availableSeats = Math.max(0, maxCapacity - alreadyBooked);
                throw new Error(`Only ${availableSeats} seat(s) available for this tour. You requested ${guestCount}.`);
            }
        }
        const originalAmount = Number(tour.costFrom) * guestCount;
        let discountAmount = 0;
        let finalAmount = originalAmount;
        let appliedCouponCode = undefined;
        if (payload.couponCode) {
            const couponResult = yield coupon_services_1.CouponServices.applyCoupon(payload.couponCode, originalAmount);
            discountAmount = couponResult.discountAmount;
            finalAmount = couponResult.finalAmount;
            appliedCouponCode = couponResult.code;
            // Increment coupon used count
            yield coupon_model_1.Coupon.findOneAndUpdate({ code: couponResult.code }, { $inc: { usedCount: 1 } }, { session });
        }
        const booking = yield booking_model_1.Booking.create([{
                user: userId,
                tour: payload.tour,
                guestCount: guestCount,
                status: booking_interface_1.BOOKING_ENUM.PENDING,
                couponCode: appliedCouponCode,
                discountAmount,
                originalAmount,
                totalAmount: finalAmount
            }], { session });
        const payment = yield payment_model_1.Payment.create([{
                booking: booking[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: finalAmount
            }], { session });
        const UpdatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session }).populate("user", "name email phone address").populate("tour", "title costFrom images location").populate("payment");
        const Name = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).name;
        const Email = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).email;
        const Phone = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).phone;
        const Addres = (UpdatedBooking === null || UpdatedBooking === void 0 ? void 0 : UpdatedBooking.user).address;
        const sslArgument = {
            amount: finalAmount,
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
const QueryBulder_1 = require("../utils/QueryBulder");
const getAllbooking = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingSearchFields = ["couponCode"];
    const modelQuery = new QueryBulder_1.QueryBuilder(booking_model_1.Booking.find()
        .populate("user", "name email phone address picture")
        .populate("tour", "title costFrom images location startDate endDate")
        .populate("payment"), query);
    const bookings = yield modelQuery
        .search(bookingSearchFields)
        .filter()
        .sort()
        .field()
        .pagination();
    const [data, meta] = yield Promise.all([
        bookings.build(),
        modelQuery.Getmeta()
    ]);
    return {
        data,
        meta
    };
});
const getsinglebooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const singleBooking = yield booking_model_1.Booking.findById(bookingId).populate("user", "name email phone address").populate("tour", "title costFrom images location").populate("payment");
    return singleBooking;
});
const deleteBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    yield booking_model_1.Booking.findByIdAndDelete(bookingId);
    if (booking.payment) {
        yield payment_model_1.Payment.findByIdAndDelete(booking.payment);
    }
    return null;
});
const getMybooking = (decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const Mybooking = yield booking_model_1.Booking.find({ user: decodedUser.userId }).populate("tour", "title costFrom images location startDate endDate").populate("payment");
    return Mybooking;
});
const cancelBookingByUser = (bookingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.user.toString() !== userId) {
        throw new Error("You are not authorized to cancel this booking");
    }
    if (booking.status !== booking_interface_1.BOOKING_ENUM.PENDING) {
        throw new Error("Only pending bookings can be cancelled by user");
    }
    booking.status = booking_interface_1.BOOKING_ENUM.CANCEL;
    yield booking.save();
    yield payment_model_1.Payment.findOneAndUpdate({ booking: booking._id }, { status: payment_interface_1.PAYMENT_STATUS.CANCEL });
    return booking;
});
const updateBookingStatusByAdmin = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    booking.status = status;
    yield booking.save();
    if (status === booking_interface_1.BOOKING_ENUM.CANCEL) {
        yield payment_model_1.Payment.findOneAndUpdate({ booking: booking._id }, { status: payment_interface_1.PAYMENT_STATUS.CANCEL });
    }
    else if (status === booking_interface_1.BOOKING_ENUM.COMPLETE) {
        yield payment_model_1.Payment.findOneAndUpdate({ booking: booking._id }, { status: payment_interface_1.PAYMENT_STATUS.PAID });
    }
    return booking;
});
exports.BookingServices = {
    createBooking,
    getAllbooking,
    getsinglebooking,
    getMybooking,
    cancelBookingByUser,
    updateBookingStatusByAdmin,
    deleteBooking
};
