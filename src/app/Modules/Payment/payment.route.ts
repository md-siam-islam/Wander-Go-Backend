import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router()

router.post("/success", PaymentController.successPayment)
router.post("/fail", PaymentController.faildPayment)
router.post("/cancel", PaymentController.cancelPayment)


export const PaymentRoutes = router 