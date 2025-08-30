import express from 'express';
import { DivisionController } from './division.controller';

const router = express.Router()

router.post("/create" , DivisionController.createDivision)
router.get("/" , DivisionController.getAllDivision)

export const DivisionRoutes = router