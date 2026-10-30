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
exports.GuideApplicationController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const guideApplication_services_1 = require("./guideApplication.services");
const applyForGuide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUser = req.user;
    const result = yield guideApplication_services_1.GuideApplicationServices.applyForGuide(req.body, decodedUser);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.CREATED,
        message: "Guide application submitted successfully",
        data: result,
    });
}));
const getMyApplication = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUser = req.user;
    const result = yield guideApplication_services_1.GuideApplicationServices.getMyApplication(decodedUser.userId);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "User guide application retrieved successfully",
        data: result,
    });
}));
const getAllApplications = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield guideApplication_services_1.GuideApplicationServices.getAllApplications(req.query);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "All guide applications retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const reviewApplication = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const decodedAdmin = req.user;
    const result = yield guideApplication_services_1.GuideApplicationServices.reviewApplication(id, req.body, decodedAdmin);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: `Guide application ${((_a = req.body.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'updated'} successfully`,
        data: result,
    });
}));
const deleteApplication = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield guideApplication_services_1.GuideApplicationServices.deleteApplication(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Guide application deleted successfully",
        data: null,
    });
}));
exports.GuideApplicationController = {
    applyForGuide,
    getMyApplication,
    getAllApplications,
    reviewApplication,
    deleteApplication,
};
