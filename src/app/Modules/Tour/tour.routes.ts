import  express  from 'express';
import { TourController } from './tour.controller';
import { validateDivision } from '../../../MIddleware/validate.division';
import { tourValidationSchema, updateTourValidationSchema } from './tour.vallidate';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';


const router = express.Router()

//  tour type routes
router.post("/create-tour-type" , TourController.TourtypeCreate)
router.get("/tour-types" , TourController.getAllTourtype)
router.get("/tour-types/:id" , TourController.GetSingleTourtype)
router.patch("/tour-types/:id" , TourController.UpdateTourtype)
router.delete("/tour-types/:id" , TourController.DeleteTourtype)

// tour routes

router.post("/create" ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN),validateDivision(tourValidationSchema), TourController.TourCreate)
router.get("/", TourController.getAlltour)
router.get("/:id" , TourController.GetSingleTour)
router.patch("/:id" ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN),validateDivision(updateTourValidationSchema), TourController.UpdateTour)
router.delete("/:id" ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN), TourController.DeleteTour)

export const TourRoutes = router