import express from 'express';
import { UserRoutes } from '../Modules/User/user.routes';
import { AuthRouter } from '../Modules/Auth/auth.routes';
import { DivisionRoutes } from '../Modules/Division/division.route';
import { TourRoutes } from '../Modules/Tour/tour.routes';
import { BookingRoutes } from '../Modules/Booking/booking.routes';
import { PaymentRoutes } from '../Modules/Payment/payment.route';
import { OtpRoutes } from '../Modules/Otp/otp.route';
import { StatsRoutes } from '../Modules/Stats/stats.route';


export const router = express.Router()

const RouterModule = [

    {
        path : "/user",
        route : UserRoutes
    },
    {
        path : "/auth",
        route : AuthRouter
    },
    {
        path : "/division",
        route : DivisionRoutes
    },
    {
        path : "/tour",
        route : TourRoutes
    },
    {
        path : "/booking",
        route : BookingRoutes
    },
    {
        path: "/payment",
        route : PaymentRoutes
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    }
]

RouterModule.forEach((route) => {
   router.use(route.path , route.route)
})

