import express  from 'express';
import { BookingController } from './booking.controller';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';

const router = express.Router()

router.post("/", checkAuth(...Object.values(Role)), BookingController.CreateBooking)

export  const BookingRoutes = router