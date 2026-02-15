"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZoodSchema = exports.createDivisionZoodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZoodSchema = zod_1.default.object({
    name: zod_1.default.string({
        required_error: "Division name is required",
        invalid_type_error: "Division name must be a string"
    }).min(2, { message: "Division name must be at least 2 characters" })
        .max(50, { message: "Division name must be at most 50 characters" }),
    slug: zod_1.default.string({
        invalid_type_error: "Division slug must be a string"
    }).optional(),
    thumbnail: zod_1.default.string({
        invalid_type_error: "Division thumbnail must be a string"
    }).optional(),
    description: zod_1.default.string({
        invalid_type_error: "Division description must be a string"
    }).optional()
});
exports.updateDivisionZoodSchema = zod_1.default.object({
    name: zod_1.default.string({
        required_error: "Division name is required",
        invalid_type_error: "Division name must be a string"
    }).min(2, { message: "Division name must be at least 2 characters" })
        .max(50, { message: "Division name must be at most 50 characters" }).optional(),
    slug: zod_1.default.string({
        invalid_type_error: "Division slug must be a string"
    }).optional(),
    thumbnail: zod_1.default.string({
        invalid_type_error: "Division thumbnail must be a string"
    }).optional(),
    description: zod_1.default.string({
        invalid_type_error: "Division description must be a string"
    }).optional()
});
