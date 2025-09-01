import express from 'express';
import { DivisionController } from './division.controller';
import { createDivisionZoodSchema, updateDivisionZoodSchema } from './division.validate';
import { validateDivision } from '../../../MIddleware/validate.division';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';

const router = express.Router()

router.post("/create" , validateDivision(createDivisionZoodSchema),checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.createDivision)
router.get("/" , DivisionController.getAllDivision)
router.patch("/:id" , validateDivision(updateDivisionZoodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.updatedDivision)
router.get("/:slug" , DivisionController.getDivisionSingle)
router.delete("/:id" , checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.DeleteDivision)

export const DivisionRoutes = router 