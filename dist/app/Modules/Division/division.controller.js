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
exports.DivisionController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../utils/catchAsync");
const division_services_1 = require("./division.services");
const sendResponse_1 = require("../utils/sendResponse");
const createDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "" });
    console.log(payload);
    const result = yield division_services_1.DivisionServices.CreateDivision(payload);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.CREATED,
        message: "Division Created Successfully",
        data: result
    });
}));
const getAllDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const getAll = yield division_services_1.DivisionServices.GetAllDivision(query);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "All Divisions Retrieved Successfully",
        data: getAll
    });
}));
const updatedDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req);
    const { id } = req.params;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "" });
    const updated = yield division_services_1.DivisionServices.UpdatedDivision(id, payload);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Division Updated Successfully",
        data: updated
    });
}));
const getDivisionSingle = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const division = yield division_services_1.DivisionServices.getSingleDivision(slug);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Division Retrieved Successfully",
        data: division
    });
}));
const DeleteDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield division_services_1.DivisionServices.DeleteDivision(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Division Deleted Successfully",
        data: null
    });
}));
exports.DivisionController = {
    createDivision,
    getAllDivision,
    updatedDivision,
    DeleteDivision,
    getDivisionSingle
};
