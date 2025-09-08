import express from 'express';
import { UserRoutes } from '../Modules/User/user.routes';
import { AuthRouter } from '../Modules/Auth/auth.router';
import { DivisionRoutes } from '../Modules/Division/division.route';
import { TourRoutes } from '../Modules/Tour/tour.routes';
import { BookingRoutes } from '../Modules/Booking/booking.routes';


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
    }
]

RouterModule.forEach((route) => {
   router.use(route.path , route.route)
})

