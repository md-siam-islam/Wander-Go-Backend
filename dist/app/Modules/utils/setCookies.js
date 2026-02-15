"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookiesAccessTokenwithRefreshToken = void 0;
const setCookiesAccessTokenwithRefreshToken = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        });
    }
};
exports.setCookiesAccessTokenwithRefreshToken = setCookiesAccessTokenwithRefreshToken;
