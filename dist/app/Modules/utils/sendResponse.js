"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sendresponse = void 0;
const Sendresponse = (res, data) => {
    res.status(data.statuscode).json({
        success: data.success,
        message: data.message,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        data: data.data,
        meta: data.meta
    });
};
exports.Sendresponse = Sendresponse;
