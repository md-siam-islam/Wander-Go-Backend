import { IsActive, IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createToken } from "../utils/jwt";
import { envVariables } from "../../config/env";
import { JwtAccessToken } from "../utils/userAccessToken";
import { sendMailer } from "../utils/emailSener";


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

const generateRefreshToken = async (refreshToken: string) => {

    const tokenInfo = jwt.verify(refreshToken, envVariables.JWT_REFRESH_SECRET) as JwtPayload;

    if (!tokenInfo) {
        throw new Error("Refresh token is required");
    }

    const isUser = await User.findOne({ email: tokenInfo.email });

    if (!isUser) {
        throw new Error("User not found from generateRefreshToken");
    }

    if (isUser.isActive === IsActive.BLOCKED) {
        throw new Error("User is not active");
    }
    if (isUser.isActive === IsActive.INACTIVE) {
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
    }

    const accessToken = createToken(JWT_payload, envVariables.JWT_SECRET, envVariables.JWT_ACCESS_TOKEN_EXPIRE)

    return {
        accessToken
    };
}


const ForgotPassword = async (email: string) => {

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new Error("User not found");
    }

    if (isUserExist.isActive === IsActive.BLOCKED) {
        throw new Error("User is not active from checkAuth 1");
    }
    if (isUserExist.isActive === IsActive.INACTIVE) {
        throw new Error("User is not active from checkAuth 2");
    }

    if (isUserExist.isDeleted) {
        throw new Error("User is not active from checkAuth 3");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVariables.JWT_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVariables.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendMailer({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgatepassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

}

// http://localhost:5173/reset-password?id=68ff6987ecbf54978fe63027&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGZmNjk4N2VjYmY1NDk3OGZlNjMwMjciLCJlbWFpbCI6Im1kc2lhbWlzbGFtNjY2M0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2MTU2OTQ1OSwiZXhwIjoxNzYxNTcwMDU5fQ.jiQt-xEui5WNtFzE3j-Duk-qvVnBS9g1cT124feo_E8


const UserResetPassword = async (oldPassword: string, newPassword: string, decodedUser: JwtPayload) => {

    const user = await User.findById(decodedUser.userId);

    if (!user) {
        throw new Error("User not found from UserResetPassword");
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password as string);

    if (!isMatch) {
        throw new Error("Old password is incorrect");
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVariables.BCRYPT_SALT_ROUNDS));

    await user.save();

    return {
        success: true,
        message: "Password reset successful"
    };
}

export const AuthServices = {
    // CredentialLogin,
    generateRefreshToken,
    UserResetPassword,
    ForgotPassword
};