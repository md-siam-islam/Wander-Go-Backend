import express  from 'express';
import { OtpController } from './otp.controller';

const router = express.Router();

router.post('/send', OtpController.sendOtp);

export const OtpRoutes = router;