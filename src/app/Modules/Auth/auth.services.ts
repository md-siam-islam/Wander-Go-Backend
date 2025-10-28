import { IsActive, IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createToken } from "../utils/jwt";
import { envVariables } from "../../config/env";
import { JwtAccessToken } from "../utils/userAccessToken";
import { sendMailer } from "../utils/emailSener";
import { decode } from "punycode";


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

const changePassword = async (decodedUser: JwtPayload, payload: Record<string, any>) => {

    const isUserExist = await User.findById(decodedUser.userId);

    if (!isUserExist) {
        throw new Error("User not found");
    }

    const { oldPassword, newPassword } = payload;

    const isMatch = await bcryptjs.compare(oldPassword, isUserExist.password as string);

    if (!isMatch) {
        throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, Number(envVariables.BCRYPT_SALT_ROUNDS));

    isUserExist.password = hashedPassword;

    await isUserExist.save();
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

// http://localhost:5173/reset-password?id=68ff6987ecbf54978fe63027&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGZmNjk4N2VjYmY1NDk3OGZlNjMwMjciLCJlbWFpbCI6Im1kc2lhbWlzbGFtNjY2M0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2MTU3MDEzMiwiZXhwIjoxNzYxNTcwNzMyfQ.4pZq1Wsv1vQ7OrhrjUGLZKDzEdIwo9SGP-3nonHclAs


const UserResetPassword = async (payload:Record<string,any>, decodedUser: JwtPayload) => {


    if (payload.id != decodedUser.userId) {
        throw new Error("You can not reset your password")
    }

    const isUserExist = await User.findById(decodedUser.userId)
    if (!isUserExist) {
        throw new Error("User does not exist")
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVariables.BCRYPT_SALT_ROUNDS)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save();

}

export const AuthServices = {
    // CredentialLogin,
    generateRefreshToken,
    UserResetPassword,
    ForgotPassword,
    changePassword
};