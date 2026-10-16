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

router.get(
    "/dashboard",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getDashboardStats
);

router.get(
    "/monthly-analytics",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getMonthlyAnalytics
);

router.get(
    "/tour-distribution",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getTourDistributionStats
);

export const StatsRoutes = router;