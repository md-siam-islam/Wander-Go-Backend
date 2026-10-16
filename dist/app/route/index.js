"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../Modules/User/user.routes");
const auth_routes_1 = require("../Modules/Auth/auth.routes");
const division_route_1 = require("../Modules/Division/division.route");
const tour_routes_1 = require("../Modules/Tour/tour.routes");
const booking_routes_1 = require("../Modules/Booking/booking.routes");
const payment_route_1 = require("../Modules/Payment/payment.route");
const otp_route_1 = require("../Modules/Otp/otp.route");
const stats_route_1 = require("../Modules/Stats/stats.route");
const review_route_1 = require("../Modules/Review/review.route");
const wishlist_route_1 = require("../Modules/Wishlist/wishlist.route");
const coupon_route_1 = require("../Modules/Coupon/coupon.route");
exports.router = express_1.default.Router();
const RouterModule = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRouter
    },
    {
        path: "/division",
        route: division_route_1.DivisionRoutes
    },
    {
        path: "/tour",
        route: tour_routes_1.TourRoutes
    },
    {
        path: "/booking",
        route: booking_routes_1.BookingRoutes
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoutes
    },
    {
        path: "/wishlist",
        route: wishlist_route_1.WishlistRoutes
    },
    {
        path: "/coupon",
        route: coupon_route_1.CouponRoutes
    }
];
RouterModule.forEach((route) => {
    exports.router.use(route.path, route.route);
});
