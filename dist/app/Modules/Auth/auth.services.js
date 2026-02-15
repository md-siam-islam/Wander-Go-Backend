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
exports.AuthServices = void 0;
const user_interface_1 = require("../User/user.interface");
const user_model_1 = require("../User/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../../config/env");
const emailSener_1 = require("../utils/emailSener");
// const CredentialLogin = async (payload : Partial<IUser>) => {
//     const { email, password } = payload;
//     const user = await User.findOne({ email });
//     if (!user) {
//         throw new Error("User not found from CredentialLogin");
//     }
//     // Check password
//     const isMatch = await bcryptjs.compare(password as string, user.password as string);
//     if (!isMatch) {
//         throw new Error("Invalid credentials");
//     }
// const userAssesToken = JwtAccessToken(user)
//     const {password: pas , ...rest} = user.toObject();
//     return {
//        accessToken: userAssesToken.accessToken,
//        refreshToken: userAssesToken.refreshToken,
//        user :rest
//     }; 
// }
const generateRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenInfo = jsonwebtoken_1.default.verify(refreshToken, env_1.envVariables.JWT_REFRESH_SECRET);
    if (!tokenInfo) {
        throw new Error("Refresh token is required");
    }
    const isUser = yield user_model_1.User.findOne({ email: tokenInfo.email });
    if (!isUser) {
        throw new Error("User not found from generateRefreshToken");
    }
    if (isUser.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new Error("User is not active");
    }
    if (isUser.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new Error("User is not active");
    }
    if (isUser.isDeleted) {
        throw new Error("User is not active");
    }
    const JWT_payload = {
        userId: isUser._id,
        email: isUser.email,
        role: isUser.role,
        auth: isUser.auth
    };
    const accessToken = (0, jwt_1.createToken)(JWT_payload, env_1.envVariables.JWT_SECRET, env_1.envVariables.JWT_ACCESS_TOKEN_EXPIRE);
    return {
        accessToken
    };
});
const changePassword = (decodedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(decodedUser.userId);
    if (!isUserExist) {
        throw new Error("User not found");
    }
    const { oldPassword, newPassword } = payload;
    const isMatch = yield bcryptjs_1.default.compare(oldPassword, isUserExist.password);
    if (!isMatch) {
        throw new Error("Old password is incorrect");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVariables.BCRYPT_SALT_ROUNDS));
    isUserExist.password = hashedPassword;
    yield isUserExist.save();
});
const ForgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new Error("User not found");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new Error("User is not active from checkAuth 1");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new Error("User is not active from checkAuth 2");
    }
    if (isUserExist.isDeleted) {
        throw new Error("User is not active from checkAuth 3");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVariables.JWT_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_1.envVariables.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, emailSener_1.sendMailer)({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgatepassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    });
});
// http://localhost:5173/reset-password?id=68ff6987ecbf54978fe63027&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGZmNjk4N2VjYmY1NDk3OGZlNjMwMjciLCJlbWFpbCI6Im1kc2lhbWlzbGFtNjY2M0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2MTU3MDEzMiwiZXhwIjoxNzYxNTcwNzMyfQ.4pZq1Wsv1vQ7OrhrjUGLZKDzEdIwo9SGP-3nonHclAs
const UserResetPassword = (payload, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedUser.userId) {
        throw new Error("You can not reset your password");
    }
    const isUserExist = yield user_model_1.User.findById(decodedUser.userId);
    if (!isUserExist) {
        throw new Error("User does not exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVariables.BCRYPT_SALT_ROUNDS));
    isUserExist.password = hashedPassword;
    yield isUserExist.save();
});
exports.AuthServices = {
    // CredentialLogin,
    generateRefreshToken,
    UserResetPassword,
    ForgotPassword,
    changePassword
};
