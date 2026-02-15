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
exports.TourController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../utils/catchAsync");
const tour_services_1 = require("./tour.services");
const sendResponse_1 = require("../utils/sendResponse");
const TourtypeCreate = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const TourType = yield tour_services_1.TourServices.CreateTourtype(req.body);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Created Successfully",
        data: TourType
    });
}));
const getAllTourtype = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const TourType = yield tour_services_1.TourServices.getAllTourtype();
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "All Tours Retrieved Successfully",
        data: TourType
    });
}));
const GetSingleTourtype = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const TourType = yield tour_services_1.TourServices.GetSingleTourtype(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Retrieved Successfully",
        data: TourType
    });
}));
const UpdateTourtype = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const Tourtype = yield tour_services_1.TourServices.UpdateTourtype(id, payload);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Updated Successfully",
        data: Tourtype
    });
}));
const DeleteTourtype = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield tour_services_1.TourServices.DeleteTourtype(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Deleted Successfully",
        data: null
    });
}));
// tour type controller end //
// tour controller start //
const TourCreate = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new Error("Testing Global Error Handling");
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const Tour = yield tour_services_1.TourServices.CreateTour(payload);
    console.log({
        data: req.body,
        files: req === null || req === void 0 ? void 0 : req.files
    });
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Created Successfully",
        data: Tour
    });
}));
const getAlltour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const Tour = yield tour_services_1.TourServices.getAllTour(query);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "All Tours Retrieved Successfully",
        data: Tour
    });
}));
const GetSingleTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Tour = yield tour_services_1.TourServices.GetSingleTour(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Retrieved Successfully",
        data: Tour
    });
}));
const UpdateTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Files in controller:", req);
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield tour_services_1.TourServices.UpdateTour(req.params.id, payload);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Updated Successfully",
        data: result
    });
}));
const DeleteTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield tour_services_1.TourServices.DeleteTour(id);
    (0, sendResponse_1.Sendresponse)(res, {
        success: true,
        statuscode: http_status_codes_1.default.OK,
        message: "Tour Deleted Successfully",
        data: null
    });
}));
exports.TourController = {
    TourtypeCreate,
    getAllTourtype,
    getAlltour,
    GetSingleTourtype,
    GetSingleTour,
    TourCreate,
    UpdateTourtype,
    UpdateTour,
    DeleteTourtype,
    DeleteTour
};
