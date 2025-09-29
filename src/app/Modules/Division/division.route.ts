import express from 'express';
import { DivisionController } from './division.controller';
import { createDivisionZoodSchema, updateDivisionZoodSchema } from './division.validate';
import { validateDivision } from '../../../MIddleware/validate.division';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';
import { multerUpload } from '../../config/multer.config';

const router = express.Router()

router.post("/create" , 
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateDivision(createDivisionZoodSchema),
    DivisionController.createDivision)

router.get("/" , DivisionController.getAllDivision)
router.patch("/:id" ,
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"), 
    validateDivision(updateDivisionZoodSchema),
    DivisionController.updatedDivision)

router.get("/:slug" , DivisionController.getDivisionSingle)
router.delete("/:id" , checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.DeleteDivision)

export const DivisionRoutes = router 