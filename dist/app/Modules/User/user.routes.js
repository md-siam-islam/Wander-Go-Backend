"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const user_interface_1 = require("./user.interface");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validate_1 = require("./user.validate");
const validate_user_1 = require("../../../MIddleware/validate.user");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const router = express_1.default.Router();
router.post('/register', (0, validate_user_1.validateUser)(user_validate_1.createUserZoodSchema), user_controller_1.UserController.CreateUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserController.AllUser);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.GetMyProfile);
router.get('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserController.getSingleUser);
router.patch('/:id', (0, validate_user_1.validateUser)(user_validate_1.updateUserZoodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.UpdateUser);
exports.UserRoutes = router;
// user ar reset password ar kaj ta holo frist a user jokhon reset password a click korbe and then tar samne akta form asbe jekhane se tar email dibo. tarpor sei email a akta link chole jabe. oi email a akta button thake oi button ta link thake frontend ar akta router ar shate like a httphttp://localhost:5173/email=""? token  jodi user oi link a click kore tahole se notun password set korte parbe.
