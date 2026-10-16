import crypto from 'crypto';
import { Otp } from './otp.model';
import { sendMailer } from '../utils/emailSener';
import { User } from '../User/user.model';
import { JwtAccessToken } from '../utils/userAccessToken';

const generateOTP = (length = 6) => {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

const sendOTP = async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.isVerified) {
        throw new Error('User is already verified');
    }

    const otp = generateOTP();

    // Store in MongoDB with auto TTL (2 minutes)
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    await sendMailer({
        to: email,
        subject: 'Your OTP Code',
        templateName: "otp",
        templateData: {
            name: user.name,
            otp: otp,
        }
    });
};

const verifyOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.isVerified) {
        throw new Error('User is already verified');
    }

    const storedOtpRecord = await Otp.findOne({ email, otp });

    if (!storedOtpRecord) {
        throw new Error('Invalid or expired OTP');
    }

    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        Otp.deleteMany({ email })
    ]);

    const tokenInfo = JwtAccessToken(user);
    return tokenInfo;
};

export const OtpService = {
    sendOTP,
    verifyOTP
};