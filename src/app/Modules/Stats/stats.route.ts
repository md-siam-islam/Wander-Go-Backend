import express from 'express';
import { Role } from '../User/user.interface';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { StatsController } from './stats.controller';

const router = express.Router();


router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getUserStats
);

export const StatsRoutes = router;