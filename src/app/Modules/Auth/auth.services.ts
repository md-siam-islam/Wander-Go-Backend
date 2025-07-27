import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/jwt";


const CredentialLogin = async (payload : Partial<IUser>) => {
    const { email, password } = payload;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    // Check password
    const isMatch = await bcryptjs.compare(password as string, user.password as string);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const JWT_payload = {
        userId: user._id,
        email: user.email,
        role : user.role,
        auth: user.auth
    }

    const accessToken = createToken(JWT_payload, "secret", "1d")


    // const accessToken = jwt.sign(JWT_payload, "secret", {
    //     expiresIn: "1h"
    // });

    return {
       accessToken
    };
}

export const AuthServices = {
    CredentialLogin
};