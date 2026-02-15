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
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../User/user.model");
const user_interface_1 = require("../User/user.interface");
const env_1 = require("../../config/env");
const mongoose_1 = require("mongoose");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superAdminEmail = env_1.envVariables.SUPER_ADMIN_EMAIL;
        const superAdminPasswordRaw = env_1.envVariables.SUPER_ADMIN_PASSWORD;
        const saltRounds = Number(env_1.envVariables.BCRYPT_SALT_ROUNDS) || 10;
        // Check if already exists
        const existingAdmin = yield user_model_1.User.findOne({ email: superAdminEmail });
        if (existingAdmin) {
            console.log("✅ Super Admin already exists:", existingAdmin.email);
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(superAdminPasswordRaw, saltRounds);
        const authProvider = {
            Provider: "Credential",
            ProviderId: superAdminEmail,
        };
        const payload = {
            _id: new mongoose_1.Types.ObjectId(),
            name: "Super Admin",
            email: superAdminEmail,
            password: hashedPassword,
            isVerified: true,
            role: user_interface_1.Role.SUPER_ADMIN,
            auth: [authProvider],
        };
        const superAdmin = yield user_model_1.User.create(payload);
        console.log("🎉 Super Admin seeded successfully:", superAdmin.email);
    }
    catch (error) {
        console.error("❌ Error seeding super admin:", error instanceof Error ? error.message : error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
