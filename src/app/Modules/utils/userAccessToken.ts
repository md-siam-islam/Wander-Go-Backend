import { envVariables } from "../../config/env";
import { IUser } from "../User/user.interface";
import { createToken } from "./jwt";


export const JwtAccessToken = (user : Partial<IUser>) => {

    const JWT_payload = {
            userId: user._id,
            email: user.email,
            role : user.role,
            auth: user.auth
     }
    
        const accessToken = createToken(JWT_payload, envVariables.JWT_SECRET, envVariables.JWT_ACCESS_TOKEN_EXPIRE)
    
        const refreshToken = createToken(JWT_payload , envVariables.JWT_REFRESH_SECRET, envVariables.JWT_REFRESH_TOKEN_EXPIRE)

    return {
        accessToken,
        refreshToken
    }

}