import express from 'express';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';


const router = express.Router();

router.post("/login", AuthController.LoginUser);
router.post("/refresh-token", AuthController.RefreshToken);
router.post("/logout", AuthController.LogoutUser);
router.post("/reset-password",checkAuth(...Object.values(Role)), AuthController.ResetPassword);

export const AuthRouter = router;


