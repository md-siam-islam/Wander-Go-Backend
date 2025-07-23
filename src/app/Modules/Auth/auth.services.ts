import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import bcryptjs from "bcryptjs";


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

    return {
        userId: user._id,
        email: user.email,
        auth: user.auth
    };
}

export const AuthServices = {
    CredentialLogin
};