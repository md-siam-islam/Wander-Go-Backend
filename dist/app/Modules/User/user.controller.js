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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_services_1 = require("./user.services");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
// user create function
const CreateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_services_1.UserServices.Createuser(req.body);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.CREATED,
        message: "User Created Successfull",
        data: user
    });
}));
// user get function
const AllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.AllUser();
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "All user get Successfull",
        data: result.data,
        meta: result.meta
    });
}));
const GetMyProfile = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_services_1.UserServices.GetMyProfile(decodedToken);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Your profile fetched successfully",
        data: result.data,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.params.id;
    const user = yield user_services_1.UserServices.getSingleUser(UserId);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "single user get Successfull",
        data: user,
    });
}));
const UpdateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.params.id;
    const payload = req.body;
    const VerifyToken = req.user;
    const user = user_services_1.UserServices.UpdateUser(UserId, payload, VerifyToken);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "User Update Successfull",
        data: user
    });
}));
exports.UserController = {
    CreateUser, AllUser, UpdateUser, GetMyProfile, getSingleUser
};
