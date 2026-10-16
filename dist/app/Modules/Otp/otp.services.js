"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_config_1 = require("../../config/redis.config");
const emailSener_1 = require("../utils/emailSener");
const user_model_1 = require("../User/user.model");
const userAccessToken_1 = require("../utils/userAccessToken");
const OTP_EXPIRY_TIME = 2 * 60; // 2 minutes in seconds
const generateOTP = (length = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    const name = user === null || user === void 0 ? void 0 : user.name;
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        throw new Error('User is already verified');
    }
    const otp = generateOTP();
    const radisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(radisKey, otp, {
        expiration: {
            type: 'EX',
            value: OTP_EXPIRY_TIME
        }
    });
    yield (0, emailSener_1.sendMailer)({
        to: email,
        subject: 'Your OTP Code',
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
        }
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        throw new Error('User is already verified');
    }
    const radisKey = `otp:${email}`;
    const storedOtp = yield redis_config_1.redisClient.get(radisKey);
    if (storedOtp !== otp) {
        throw new Error('Invalid OTP');
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del([radisKey])
    ]);
    const tokenInfo = (0, userAccessToken_1.JwtAccessToken)(user);
    return tokenInfo;
});
exports.OtpService = {
    sendOTP,
    verifyOTP
};
