import { Response } from "express";

interface TokenInfo {
    accessToken?: string;
    refreshToken?: string;
}

export const setCookiesAccessTokenwithRefreshToken = (res: Response, tokenInfo: TokenInfo) => {


    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: "none"
         })
    }


    if (tokenInfo.refreshToken) { 
        res.cookie('refreshToken', tokenInfo.refreshToken, { 
            httpOnly: true,
             secure: true,
            sameSite: "none"
            
        }) }


}
