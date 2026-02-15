"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAccessToken = void 0;
const env_1 = require("../../config/env");
const jwt_1 = require("./jwt");
const JwtAccessToken = (user) => {
    const JWT_payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        auth: user.auth
    };
    const accessToken = (0, jwt_1.createToken)(JWT_payload, env_1.envVariables.JWT_SECRET, env_1.envVariables.JWT_ACCESS_TOKEN_EXPIRE);
    const refreshToken = (0, jwt_1.createToken)(JWT_payload, env_1.envVariables.JWT_REFRESH_SECRET, env_1.envVariables.JWT_REFRESH_TOKEN_EXPIRE);
    return {
        accessToken,
        refreshToken
    };
};
exports.JwtAccessToken = JwtAccessToken;
