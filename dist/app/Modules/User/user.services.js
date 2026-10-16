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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const Createuser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new Error(" This Email User already exists");
    }
    // const emailExists = await User.findOne({ email });
    //    if (emailExists) {
    //         const error: any = new Error("User already exists");
    //         error.statusCode = 409; 
    //         throw error;
    //     }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVariables.BCRYPT_SALT_ROUNDS));
    console.log(hashedPassword);
    // const isExixt = await bcrypt.compare(password as string , hashedPassword)
    // console.log(isExixt);
    const authProvider = { Provider: "Credential", ProviderId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auth: [authProvider] }, rest));
    return user;
});
const UpdateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
        if (decodedToken.userId !== userId) {
            throw new Error("You are not authorized to update other user profile");
        }
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found from UpdateUser");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN && user.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new Error("You are not authorized to update Super Admin profile");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new Error("You are not authorized to update user role");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new Error("You are not authorized to update user role");
        }
    }
    if (payload.isActive || payload.isVerified || payload.isDeleted) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new Error("You are not authorized to update user status");
        }
    }
    const updateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return updateUser;
});
const AllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find({}).select('-password -auth -isDeleted -createdAt -updatedAt');
    const totalUser = yield user_model_1.User.countDocuments();
    return {
        data: user,
        meta: {
            total: totalUser
        }
    };
});
const GetMyProfile = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId).select('-password -auth -isDeleted -createdAt -updatedAt');
    return {
        data: user
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select('-password -auth -isDeleted -createdAt -updatedAt');
    if (!user) {
        throw new Error("User not found from getSingleUser");
    }
    return user;
});
exports.UserServices = {
    Createuser,
    AllUser,
    UpdateUser,
    GetMyProfile,
    getSingleUser
};
