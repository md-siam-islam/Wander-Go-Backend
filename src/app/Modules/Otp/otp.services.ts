import crypto from 'crypto';
import { redisClient } from '../../config/redis.config';
import { sendMailer } from '../utils/emailSener';
import { User } from '../User/user.model';
import { promise } from 'zod';

const OTP_EXPIRY_TIME = 2 * 60; // 2 minutes in seconds

const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(10**(length - 1), 10**length).toString()
    return otp;
}
  

const sendOTP = async (email : string , name : string) => {

    const user = await User.findOne({ email });

    if(!user){
        throw new Error('User not found');
    }

    if(user.isVerified){
        throw new Error('User is already verified');
    }

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

const verifyOTP = async (email: string, otp: string) => {

    const user = await User.findOne({ email });

    if(!user){
        throw new Error('User not found');
    }

    if(user.isVerified){
        throw new Error('User is already verified');
    }

    const radisKey = `otp:${email}`;

    const storedOtp = await redisClient.get(radisKey);

    if (storedOtp !== otp) {
        throw new Error('Invalid OTP');
    }

   await Promise.all([
      User.updateOne({ email }, { isVerified: true } , {runValidators : true}),
      redisClient.del([radisKey])
   ]);
}

export const OtpService = {
    sendOTP,
    verifyOTP
};