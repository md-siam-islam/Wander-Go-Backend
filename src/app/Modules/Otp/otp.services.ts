import crypto from 'crypto';
import { redisClient } from '../../config/redis.config';
import { sendMailer } from '../utils/emailSener';

const OTP_EXPIRY_TIME = 2 * 60; // 2 minutes in seconds

const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(10**(length - 1), 10**length).toString()
    return otp;
}
  

const sendOTP = async (email : string , name : string) => {

    const otp = generateOTP();

    const radisKey = `otp:${email}`;

    await redisClient.set(radisKey, otp ,{ 
        expiration: {
            type : 'EX',
            value : OTP_EXPIRY_TIME
        }
    }) 

    await sendMailer({
        to: email,
        subject: 'Your OTP Code',
        templateName: "otp",
        templateData: {
            name: name,
            otp : otp,
        }
    })
    
}

export const OtpService = {
    sendOTP
};