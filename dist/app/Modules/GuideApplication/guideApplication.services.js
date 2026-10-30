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
exports.GuideApplicationServices = void 0;
const guideApplication_interface_1 = require("./guideApplication.interface");
const guideApplication_model_1 = require("./guideApplication.model");
const user_model_1 = require("../User/user.model");
const user_interface_1 = require("../User/user.interface");
const QueryBulder_1 = require("../utils/QueryBulder");
const applyForGuide = (payload, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedUser.userId;
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new Error("User not found");
    }
    if (existingUser.role === user_interface_1.Role.GUIDE) {
        throw new Error("You are already a certified Tour Guide");
    }
    // Check if there is an existing pending application
    const existingPending = yield guideApplication_model_1.GuideApplication.findOne({
        user: userId,
        status: guideApplication_interface_1.ApplicationStatus.PENDING,
    });
    if (existingPending) {
        throw new Error("You already have an application under review. Please wait for admin approval.");
    }
    const application = yield guideApplication_model_1.GuideApplication.create(Object.assign(Object.assign({}, payload), { user: userId, email: existingUser.email, status: guideApplication_interface_1.ApplicationStatus.PENDING }));
    return application;
});
const getMyApplication = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield guideApplication_model_1.GuideApplication.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .populate("reviewedBy", "name email");
    return application;
});
const getAllApplications = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchFields = ["fullName", "email", "phone", "nidOrPassport"];
    const modelQuery = new QueryBulder_1.QueryBuilder(guideApplication_model_1.GuideApplication.find()
        .populate("user", "name email picture phone role isActive")
        .populate("reviewedBy", "name email"), query);
    const applications = yield modelQuery
        .search(searchFields)
        .filter()
        .sort()
        .field()
        .pagination();
    const [data, meta] = yield Promise.all([
        applications.build(),
        modelQuery.Getmeta(),
    ]);
    return {
        data,
        meta,
    };
});
const reviewApplication = (applicationId, payload, decodedAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield guideApplication_model_1.GuideApplication.findById(applicationId);
    if (!application) {
        throw new Error("Guide application not found");
    }
    application.status = payload.status;
    application.adminFeedback = payload.adminFeedback || (payload.status === guideApplication_interface_1.ApplicationStatus.APPROVED ? "Application approved" : "Application rejected");
    application.reviewedBy = decodedAdmin.userId;
    application.reviewedAt = new Date();
    yield application.save();
    // If approved, update user's role to GUIDE!
    if (payload.status === guideApplication_interface_1.ApplicationStatus.APPROVED) {
        yield user_model_1.User.findByIdAndUpdate(application.user, { role: user_interface_1.Role.GUIDE });
    }
    else if (payload.status === guideApplication_interface_1.ApplicationStatus.REJECTED) {
        // If rejected and currently guide, revert to USER
        const applicant = yield user_model_1.User.findById(application.user);
        if (applicant && applicant.role === user_interface_1.Role.GUIDE) {
            applicant.role = user_interface_1.Role.USER;
            yield applicant.save();
        }
    }
    const updatedApplication = yield guideApplication_model_1.GuideApplication.findById(applicationId)
        .populate("user", "name email picture phone role isActive")
        .populate("reviewedBy", "name email");
    return updatedApplication;
});
const deleteApplication = (applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield guideApplication_model_1.GuideApplication.findByIdAndDelete(applicationId);
    return result;
});
exports.GuideApplicationServices = {
    applyForGuide,
    getMyApplication,
    getAllApplications,
    reviewApplication,
    deleteApplication,
};
