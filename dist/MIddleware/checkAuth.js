"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jwt_1 = require("../app/Modules/utils/jwt");
const env_1 = require("../app/config/env");
const user_model_1 = require("../app/Modules/User/user.model");
const user_interface_1 = require("../app/Modules/User/user.interface");
const checkAuth = (...role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error("No token provided from checkAuth");
        }
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        const verify = (0, jwt_1.verifyToken)(token, env_1.envVariables.JWT_SECRET);
        const isUser = yield user_model_1.User.findOne({ email: verify.email });
        if (!isUser) {
            throw new Error("User not found from checkAuth");
        }
        if (isUser.isActive === user_interface_1.IsActive.BLOCKED) {
            throw new Error("User is not active from checkAuth 1");
        }
        if (isUser.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new Error("User is not active from checkAuth 2");
        }
        console.log("Role from token:", role);
        console.log("Role from token:", verify.role);
        if (isUser.isDeleted) {
            throw new Error("User is not active from checkAuth 3");
        }
        if (!role.includes(verify.role)) {
            throw new Error("You are not authorized to access this resource");
        }
        req.user = verify;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
