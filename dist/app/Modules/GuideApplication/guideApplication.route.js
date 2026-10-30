"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const guideApplication_controller_1 = require("./guideApplication.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const router = express_1.default.Router();
// User submits application
router.post("/apply", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), guideApplication_controller_1.GuideApplicationController.applyForGuide);
// User checks their own application
router.get("/my-application", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), guideApplication_controller_1.GuideApplicationController.getMyApplication);
// Admin / Super Admin gets all applications
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), guideApplication_controller_1.GuideApplicationController.getAllApplications);
// Admin / Super Admin reviews (Approves or Rejects) application
router.patch("/review/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), guideApplication_controller_1.GuideApplicationController.reviewApplication);
// Admin deletes application
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), guideApplication_controller_1.GuideApplicationController.deleteApplication);
exports.GuideApplicationRoutes = router;
