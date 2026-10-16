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
exports.StatsService = void 0;
const user_interface_1 = require("../User/user.interface");
const user_model_1 = require("../User/user.model");
const booking_model_1 = require("../Booking/booking.model");
const payment_model_1 = require("../Payment/payment.model");
const payment_interface_1 = require("../Payment/payment.interface");
const tour_model_1 = require("../Tour/tour.model");
const booking_interface_1 = require("../Booking/booking.interface");
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const lastSevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastThirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUser = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalInactiveUser = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE });
    const totalBlockedUser = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED });
    const lastSevenDaysUsersPromise = user_model_1.User.countDocuments({ createdAt: { $gte: lastSevenDays } });
    const lastThirtyDaysUsersPromise = user_model_1.User.countDocuments({ createdAt: { $gte: lastThirtyDays } });
    const userByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalActive, totalInactive, totalBlocked, newUsersInLast7Days, newUsersInLast30Days, userByRole] = yield Promise.all([
        totalUsersPromise,
        totalActiveUser,
        totalInactiveUser,
        totalBlockedUser,
        lastSevenDaysUsersPromise,
        lastThirtyDaysUsersPromise,
        userByRolePromise
    ]);
    return {
        totalUsers,
        totalActive,
        totalInactive,
        totalBlocked,
        newUsersInLast7Days,
        newUsersInLast30Days,
        userByRole
    };
});
const getAdminDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const now = new Date();
    const lastThirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [totalUsers, totalTours, totalBookings, completedBookings, pendingBookings, cancelledBookings, totalRevenueResult, last30DaysRevenueResult, recentBookings] = yield Promise.all([
        user_model_1.User.countDocuments(),
        tour_model_1.Tour.countDocuments(),
        booking_model_1.Booking.countDocuments(),
        booking_model_1.Booking.countDocuments({ status: booking_interface_1.BOOKING_ENUM.COMPLETE }),
        booking_model_1.Booking.countDocuments({ status: booking_interface_1.BOOKING_ENUM.PENDING }),
        booking_model_1.Booking.countDocuments({ status: booking_interface_1.BOOKING_ENUM.CANCEL }),
        payment_model_1.Payment.aggregate([
            { $match: { status: payment_interface_1.PAYMENT_STATUS.PAID } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        payment_model_1.Payment.aggregate([
            {
                $match: {
                    status: payment_interface_1.PAYMENT_STATUS.PAID,
                    createdAt: { $gte: lastThirtyDays }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        booking_model_1.Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email phone picture")
            .populate("tour", "title costFrom images location")
            .populate("payment", "amount status transactionId")
    ]);
    const totalRevenue = ((_a = totalRevenueResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const last30DaysRevenue = ((_b = last30DaysRevenueResult[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
    return {
        overview: {
            totalUsers,
            totalTours,
            totalBookings,
            completedBookings,
            pendingBookings,
            cancelledBookings,
            totalRevenue,
            last30DaysRevenue
        },
        recentBookings
    };
});
exports.StatsService = {
    getUserStats,
    getAdminDashboardStats
};
