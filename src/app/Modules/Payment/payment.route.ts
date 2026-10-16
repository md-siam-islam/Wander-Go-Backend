import express from 'express';
import { PaymentController } from './payment.controller';

import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';

const router = express.Router()

router.post("/init-payment/:bookingId", PaymentController.initPayment)
router.post("/success", PaymentController.successPayment)
router.post("/fail", PaymentController.faildPayment)
router.post("/cancel", PaymentController.cancelPayment)

// Admin: Get all payments/transactions with search, filter, pagination
router.get("/all-payments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PaymentController.getAllPayments)

// Admin: Get single payment transaction details
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PaymentController.getSinglePayment)

export const PaymentRoutes = router 