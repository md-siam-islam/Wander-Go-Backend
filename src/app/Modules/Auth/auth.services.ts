import { IsActive, IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createToken } from "../utils/jwt";
import { envVariables } from "../../config/env";
import { JwtAccessToken } from "../utils/userAccessToken";


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

    const tokenInfo =  jwt.verify(refreshToken, envVariables.JWT_REFRESH_SECRET) as JwtPayload;
    
    if (!tokenInfo) {
        throw new Error("Refresh token is required");
    }

    const isUser = await User.findOne({ email : tokenInfo.email });

    if (!isUser) {
        throw new Error("User not found from generateRefreshToken");
    }

    if(isUser.isActive === IsActive.BLOCKED) {
        throw new Error("User is not active");
    }
    if(isUser.isActive === IsActive.INACTIVE) {
        throw new Error("User is not active");
    }
    if(isUser.isDeleted){
        throw new Error("User is not active");
    }

    const JWT_payload = {
        userId: isUser._id,
        email: isUser.email,
        role : isUser.role,
        auth: isUser.auth
    }

    const accessToken = createToken(JWT_payload, envVariables.JWT_SECRET, envVariables.JWT_ACCESS_TOKEN_EXPIRE)

    return {
        accessToken
    }; 
}


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
    UserResetPassword
};