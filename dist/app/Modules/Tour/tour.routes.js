"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tour_controller_1 = require("./tour.controller");
const tour_vallidate_1 = require("./tour.vallidate");
const checkAuth_1 = require("../../../MIddleware/checkAuth");
const user_interface_1 = require("../User/user.interface");
const multer_config_1 = require("../../config/multer.config");
const tourValidatio_1 = require("../../../MIddleware/tourValidatio");
const router = express_1.default.Router();
//  tour type routes
router.post("/create-tour-type", tour_controller_1.TourController.TourtypeCreate);
router.get("/tour-types", tour_controller_1.TourController.getAllTourtype);
router.get("/tour-types/:id", tour_controller_1.TourController.GetSingleTourtype);
router.patch("/tour-types/:id", tour_controller_1.TourController.UpdateTourtype);
router.delete("/tour-types/:id", tour_controller_1.TourController.DeleteTourtype);
// tour routes
router.post("/create", 
// checkAuth(Role.ADMIN , Role.SUPER_ADMIN),
multer_config_1.multerUpload.array("files"), (0, tourValidatio_1.validateTour)(tour_vallidate_1.tourValidationSchema), tour_controller_1.TourController.TourCreate);
router.get("/", tour_controller_1.TourController.getAlltour);
router.get("/:id", tour_controller_1.TourController.GetSingleTour);
router.patch("/:id", 
// checkAuth(Role.ADMIN , Role.SUPER_ADMIN),
multer_config_1.multerUpload.array("files"), (0, tourValidatio_1.validateTour)(tour_vallidate_1.updateTourValidationSchema), tour_controller_1.TourController.UpdateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.DeleteTour);
exports.TourRoutes = router;
