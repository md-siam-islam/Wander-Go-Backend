import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post("/login", AuthController.LoginUser);
router.post("/refresh-token", AuthController.RefreshToken);
router.post("/logout", AuthController.LogoutUser);

export const AuthRouter = router;


