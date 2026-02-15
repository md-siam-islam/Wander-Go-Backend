"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const router = express_1.default.Router();
// create booking
router.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingController.CreateBooking);
// get all booking 
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), booking_controller_1.BookingController.getAllbooking);
// get my booking 
router.get("/myBooking", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingController.getMybooking);
// get single booking
router.get("/:bookingId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), booking_controller_1.BookingController.getsinglebooking);
exports.BookingRoutes = router;
