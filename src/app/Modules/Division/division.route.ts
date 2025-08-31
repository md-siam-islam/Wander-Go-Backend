import express from 'express';
import { DivisionController } from './division.controller';
import { createDivisionZoodSchema, updateDivisionZoodSchema } from './division.validate';
import { validateDivision } from '../../../MIddleware/validate.division';

const router = express.Router()

router.post("/create" ,  validateDivision(createDivisionZoodSchema), DivisionController.createDivision)
router.get("/" , DivisionController.getAllDivision)
router.patch("/:id" , validateDivision(updateDivisionZoodSchema) , DivisionController.updatedDivision)
router.get("/:slug" , DivisionController.getDivisionSingle)
router.delete("/:id" , DivisionController.DeleteDivision)

export const DivisionRoutes = router 