import { IsActive } from "../User/user.interface";
import { User } from "../User/user.model";
import { Booking } from "../Booking/booking.model";
import { Payment } from "../Payment/payment.model";
import { PAYMENT_STATUS } from "../Payment/payment.interface";
import { Tour } from "../Tour/tour.model";
import { BOOKING_ENUM } from "../Booking/booking.interface";

const getUserStats = async () => {
    const now = new Date();
    const lastSevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastThirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalUsersPromise = User.countDocuments();
    const totalActiveUser = User.countDocuments({ isActive: IsActive.ACTIVE });
    const totalInactiveUser = User.countDocuments({ isActive: IsActive.INACTIVE });
    const totalBlockedUser = User.countDocuments({ isActive: IsActive.BLOCKED });

    const lastSevenDaysUsersPromise = User.countDocuments({ createdAt: { $gte: lastSevenDays } });
    const lastThirtyDaysUsersPromise = User.countDocuments({ createdAt: { $gte: lastThirtyDays } });

    const userByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);

    const [totalUsers, totalActive, totalInactive, totalBlocked, newUsersInLast7Days, newUsersInLast30Days, userByRole] = await Promise.all([
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
};

const getAdminDashboardStats = async () => {
    const now = new Date();
    const lastThirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalUsers,
        totalTours,
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenueResult,
        last30DaysRevenueResult,
        recentBookings
    ] = await Promise.all([
        User.countDocuments(),
        Tour.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: BOOKING_ENUM.COMPLETE }),
        Booking.countDocuments({ status: BOOKING_ENUM.PENDING }),
        Booking.countDocuments({ status: BOOKING_ENUM.CANCEL }),
        Payment.aggregate([
            { $match: { status: PAYMENT_STATUS.PAID } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        Payment.aggregate([
            {
                $match: {
                    status: PAYMENT_STATUS.PAID,
                    createdAt: { $gte: lastThirtyDays }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email phone picture")
            .populate("tour", "title costFrom images location")
            .populate("payment", "amount status transactionId")
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const last30DaysRevenue = last30DaysRevenueResult[0]?.total || 0;

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
};

const getMonthlyAnalytics = async () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Payment.aggregate([
        {
            $match: {
                status: PAYMENT_STATUS.PAID,
                createdAt: { $gte: twelveMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                revenue: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyBookings = await Booking.aggregate([
        {
            $match: {
                createdAt: { $gte: twelveMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalBookings: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return {
        monthlyRevenue,
        monthlyBookings
    };
};

const getTourDistributionStats = async () => {
    const toursByDivision = await Tour.aggregate([
        {
            $group: {
                _id: "$division",
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "divisions",
                localField: "_id",
                foreignField: "_id",
                as: "divisionDetails"
            }
        },
        { $unwind: { path: "$divisionDetails", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                name: { $ifNull: ["$divisionDetails.name", "Unknown"] },
                count: 1
            }
        }
    ]);

    const toursByType = await Tour.aggregate([
        {
            $group: {
                _id: "$tourType",
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "tourtypes",
                localField: "_id",
                foreignField: "_id",
                as: "tourTypeDetails"
            }
        },
        { $unwind: { path: "$tourTypeDetails", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                name: { $ifNull: ["$tourTypeDetails.name", "Unknown"] },
                count: 1
            }
        }
    ]);

    return {
        toursByDivision,
        toursByType
    };
};

export const StatsService = {
    getUserStats,
    getAdminDashboardStats,
    getMonthlyAnalytics,
    getTourDistributionStats
};