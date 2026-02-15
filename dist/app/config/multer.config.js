"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.CloudinaryUpload,
    params: {
        public_id: (req, file) => {
            // console.log("Cloudinary Config File" , envVariables.CLOUDINARY.CLOUDINARY_API_KEY);
            const cleanName = file.originalname
                .toLowerCase()
                .replace(/[\s.]+/g, "-")
                .replace(/[^a-z0-9-]+/g, "");
            const extention = file.originalname.split(".").pop();
            const unicFilename = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + cleanName + "." + extention;
            return unicFilename;
        },
    },
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
