"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const router = express_1.default.Router();
router.post("/init-payment/:bookingId", payment_controller_1.PaymentController.initPayment);
router.post("/success", payment_controller_1.PaymentController.successPayment);
router.post("/fail", payment_controller_1.PaymentController.faildPayment);
router.post("/cancel", payment_controller_1.PaymentController.cancelPayment);
// Admin: Get all payments/transactions with search, filter, pagination
router.get("/all-payments", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), payment_controller_1.PaymentController.getAllPayments);
// Admin: Get single payment transaction details
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), payment_controller_1.PaymentController.getSinglePayment);
exports.PaymentRoutes = router;
