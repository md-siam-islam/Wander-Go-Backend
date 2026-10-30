import express from "express";
import { GuideApplicationController } from "./guideApplication.controller";
import { checkAuth } from "../../../MIddleware/checkAuth";
import { Role } from "../User/user.interface";

const router = express.Router();

// User submits application
router.post(
  "/apply",
  checkAuth(...Object.values(Role)),
  GuideApplicationController.applyForGuide
);

// User checks their own application
router.get(
  "/my-application",
  checkAuth(...Object.values(Role)),
  GuideApplicationController.getMyApplication
);

// Admin / Super Admin gets all applications
router.get(
  "/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideApplicationController.getAllApplications
);

// Admin / Super Admin reviews (Approves or Rejects) application
router.patch(
  "/review/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideApplicationController.reviewApplication
);

// Admin deletes application
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideApplicationController.deleteApplication
);

export const GuideApplicationRoutes = router;
