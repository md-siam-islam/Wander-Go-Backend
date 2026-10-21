import { CookieOptions, Response } from "express";

interface TokenInfo {
    accessToken?: string;
    refreshToken?: string;
}

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
};

export const setCookiesAccessTokenwithRefreshToken = (res: Response, tokenInfo: TokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, cookieOptions);
    }

    if (tokenInfo.refreshToken) { 
        res.cookie('refreshToken', tokenInfo.refreshToken, cookieOptions);
    }
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
};
