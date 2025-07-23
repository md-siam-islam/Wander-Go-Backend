import express from 'express';
import { UserRoutes } from '../Modules/User/user.routes';
import { AuthRouter } from '../Modules/Auth/auth.router';


export const router = express.Router()

const RouterModule = [

    {
        path : "/user",
        route : UserRoutes
    },
    {
        path : "/auth",
        route : AuthRouter
    }
]

RouterModule.forEach((route) => {
   router.use(route.path , route.route)
})

