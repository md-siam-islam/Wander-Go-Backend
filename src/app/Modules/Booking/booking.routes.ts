import express  from 'express';
import { BookingController } from './booking.controller';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';

import { createBookingZodSchema } from './booking.validation';
import { validateRequest } from '../../../MIddleware/validate.user';

const router = express.Router()

// create booking
router.post("/", checkAuth(...Object.values(Role)), validateRequest(createBookingZodSchema), BookingController.CreateBooking)

// get all booking 
router.get("/",checkAuth(Role.ADMIN , Role.SUPER_ADMIN), BookingController.getAllbooking)

// get my booking 
router.get("/myBooking" ,checkAuth(...Object.values(Role)), BookingController.getMybooking)

// get single booking
router.get("/:bookingId",checkAuth(Role.ADMIN , Role.SUPER_ADMIN), BookingController.getsinglebooking)




export  const BookingRoutes = router