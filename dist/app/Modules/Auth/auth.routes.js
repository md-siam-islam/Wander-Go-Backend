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
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post("/login", auth_controller_1.AuthController.LoginUser);
router.post("/refresh-token", auth_controller_1.AuthController.RefreshToken);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthController.changePassword);
router.post("/logout", auth_controller_1.AuthController.LogoutUser);
router.post("/forgot-password", auth_controller_1.AuthController.ForgotPassword);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthController.ResetPassword);
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("google", {
        scope: ["email", "profile"]
    })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_controller_1.AuthController.GoogleAuthCallback);
exports.AuthRouter = router;
