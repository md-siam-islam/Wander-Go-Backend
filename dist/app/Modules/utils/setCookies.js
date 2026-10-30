"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setCookiesAccessTokenwithRefreshToken = exports.cookieOptions = void 0;
exports.cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
};
const setCookiesAccessTokenwithRefreshToken = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, exports.cookieOptions);
    }
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, exports.cookieOptions);
    }
};
exports.setCookiesAccessTokenwithRefreshToken = setCookiesAccessTokenwithRefreshToken;
const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", exports.cookieOptions);
    res.clearCookie("refreshToken", exports.cookieOptions);
};
exports.clearAuthCookies = clearAuthCookies;
