import  express  from 'express';
import { TourController } from './tour.controller';


const router = express.Router()


router.post("/create-tour-type" , TourController.TourtypeCreate)
router.get("/tour-types" , TourController.getAllTourtype)
router.get("/tour-types/:id" , TourController.GetSingleTourtype)
router.patch("/tour-types/:id" , TourController.UpdateTourtype)

export const TourRoutes = router