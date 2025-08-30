import express from 'express';
import { DivisionController } from './division.controller';

const router = express.Router()

router.post("/create" , DivisionController.createDivision)

export const DivisionRoutes = router