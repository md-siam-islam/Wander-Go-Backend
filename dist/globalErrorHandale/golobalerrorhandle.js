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
exports.globalErrorHandle = void 0;
const env_1 = require("../app/config/env");
const cloudinary_config_1 = require("../app/config/cloudinary.config");
const globalErrorHandle = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVariables.NODE_ENV === "development") {
        console.log(error);
    }
    // cloudenary error hole image delete korar funtion 
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, cloudinary_config_1.deleteImageFromCloudinary)(file.path);
        })));
    }
    ;
    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid value for field "${error.path}": received "${error.value}"`,
            errorType: "CastError",
        });
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || "field";
        const value = error.keyValue ? error.keyValue[field] : "";
        return res.status(400).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" already exists`,
            errorType: "DuplicateKeyError",
        });
    }
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((val) => ({
            field: val.path,
            message: val.message,
        }));
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors,
        });
    }
    if (error.name === "ZodError") {
        const message = error.errors.map((err) => err.message).join(", ");
        console.log("Zod Validation Error", message);
        return res.status(400).json({
            success: false,
            message,
        });
    }
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }
    res.status(500).json({
        success: false,
        message: `${error.message}`,
        error: env_1.envVariables.NODE_ENV === "development" ? error : null,
        stack: env_1.envVariables.NODE_ENV === "development" ? error.stack : null,
    });
});
exports.globalErrorHandle = globalErrorHandle;
