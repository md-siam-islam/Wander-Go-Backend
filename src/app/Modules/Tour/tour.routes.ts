import  express  from 'express';
import { TourController } from './tour.controller';
import { validateDivision } from '../../../MIddleware/validate.division';
import { tourValidationSchema } from './tour.vallidate';


const router = express.Router()

//  tour type routes
router.post("/create-tour-type" , TourController.TourtypeCreate)
router.get("/tour-types" , TourController.getAllTourtype)
router.get("/tour-types/:id" , TourController.GetSingleTourtype)
router.patch("/tour-types/:id" , TourController.UpdateTourtype)
router.delete("/tour-types/:id" , TourController.DeleteTourtype)

// tour routes

router.post("/create" , validateDivision(tourValidationSchema), TourController.TourCreate)


export const TourRoutes = router