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
exports.CloudinaryUpload = exports.deleteImageFromCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
console.log("Cloudinary Config File", env_1.envVariables.CLOUDINARY.CLOUDINARY_API_KEY);
cloudinary_1.v2.config({
    cloud_name: env_1.envVariables.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVariables.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env_1.envVariables.CLOUDINARY.CLOUDINARY_API_SECRET
});
const deleteImageFromCloudinary = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        console.log("Matched URL:", match);
        if (match && match[1]) {
            const publicId = match[1];
            yield cloudinary_1.v2.uploader.destroy(publicId);
            console.log(`File ${publicId} is deleted from cloudinary`);
        }
    }
    catch (error) {
        console.error("Error deleting file from cloudinary:", error);
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
exports.CloudinaryUpload = cloudinary_1.v2;
