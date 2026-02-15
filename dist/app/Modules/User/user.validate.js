"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZoodSchema = exports.createUserZoodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
//  export const createUserZoodSchema = z.object({
//                      name: z
//     .string({ invalid_type_error: "Name must be a string" })
//     .min(2, { message: "Name must be at least 2 characters" })
//     .max(50, { message: "Name must be at most 50 characters" }),
//   email: z
//     .string({ invalid_type_error: "Email must be a string" })
//     .email({ message: "Invalid email address" }),
//   phone: z
//     .string()
//     .regex(/^(\+8801|8801|01)[3-9]\d{8}$/, {
//     message: "Phone number must be a valid Bangladeshi number",
//   })
//     .optional(),
//   password: z
//   .string()
//   .min(8, { message: "Password must be at least 8 characters long" })
//   .max(100, { message: "Password must be less than 100 characters" })
//   .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/,
//     {
//       message:
//         "Password must include uppercase, lowercase, number, and one of these symbols: !, @, #, $, %",
//     }
//   )
//     })
const user_interface_1 = require("./user.interface");
exports.createUserZoodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be at most 50 characters" }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be a string" })
        .email({ message: "Invalid email address" }),
    phone: zod_1.default
        .string()
        .regex(/^(\+8801|8801|01)[3-9]\d{8}$/, {
        message: "Phone number must be a valid Bangladeshi number",
    })
        .optional(),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be less than 100 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%]{8,}$/, {
        message: "Password must include uppercase, lowercase, number, and one of these symbols: !, @, #, $, %",
    }),
    role: zod_1.default
        .enum([user_interface_1.Role.USER, user_interface_1.Role.ADMIN], {
        errorMap: () => ({ message: `Role must be one of: ${user_interface_1.Role.USER}, ${user_interface_1.Role.ADMIN}` }),
    })
        .optional(),
    isDeleted: zod_1.default
        .boolean({ invalid_type_error: "isDeleted must be a boolean value" })
        .optional(),
    isActive: zod_1.default
        .enum([user_interface_1.IsActive.ACTIVE, user_interface_1.IsActive.INACTIVE], {
        errorMap: () => ({ message: `isActive must be either ACTIVE or INACTIVE` }),
    })
        .optional(),
    isVerified: zod_1.default
        .boolean({ invalid_type_error: "isVerified must be a boolean value" })
        .optional(),
    picture: zod_1.default.string().optional(),
    address: zod_1.default.string().optional(),
    auth: zod_1.default
        .array(zod_1.default.object({
        Provider: zod_1.default.string(),
        ProviderId: zod_1.default.string(),
    }))
        .optional(),
});
exports.updateUserZoodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be at most 50 characters" }).optional(),
    phone: zod_1.default
        .string()
        .regex(/^(\+8801|8801|01)[3-9]\d{8}$/, {
        message: "Phone number must be a valid Bangladeshi number",
    })
        .optional(),
});
