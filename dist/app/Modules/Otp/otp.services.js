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
const otp_model_1 = require("./otp.model");
const emailSener_1 = require("../utils/emailSener");
const user_model_1 = require("../User/user.model");
const userAccessToken_1 = require("../utils/userAccessToken");
const generateOTP = (length = 6) => {
    return crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
};
const sendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        throw new Error('User is already verified');
    }
    const otp = generateOTP();
    // Store in MongoDB with auto TTL (2 minutes)
    yield otp_model_1.Otp.deleteMany({ email });
    yield otp_model_1.Otp.create({ email, otp });
    yield (0, emailSener_1.sendMailer)({
        to: email,
        subject: 'Your OTP Code',
        templateName: "otp",
        templateData: {
            name: user.name,
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
    const storedOtpRecord = yield otp_model_1.Otp.findOne({ email, otp });
    if (!storedOtpRecord) {
        throw new Error('Invalid or expired OTP');
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        otp_model_1.Otp.deleteMany({ email })
    ]);
    const tokenInfo = (0, userAccessToken_1.JwtAccessToken)(user);
    return tokenInfo;
});
exports.OtpService = {
    sendOTP,
    verifyOTP
};
