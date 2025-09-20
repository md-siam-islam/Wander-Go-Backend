import express  from 'express';
import { BookingController } from './booking.controller';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';

const router = express.Router()

// create booking
router.post("/", checkAuth(...Object.values(Role)), BookingController.CreateBooking)


// get all booking 
router.get("/",checkAuth(...Object.values(Role)), BookingController.getAllbooking)

router.get("/:bookingId",checkAuth(...Object.values(Role)), BookingController.getsinglebooking)

export  const BookingRoutes = router