import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../../MIddleware/checkAuth';
import { Role } from '../User/user.interface';
import passport from 'passport';


const router = express.Router();

router.post("/login", AuthController.LoginUser);
router.post("/refresh-token", AuthController.RefreshToken);
router.post("/logout", AuthController.LogoutUser);
router.post("/forgot-password", AuthController.ForgotPassword);
router.post("/reset-password",checkAuth(...Object.values(Role)), AuthController.ResetPassword);

router.get("/google", async (req: Request , res: Response , next: NextFunction) => {
    passport.authenticate("google", {
        scope: ["email", "profile"]
    })(req, res, next);
});

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), AuthController.GoogleAuthCallback)

export const AuthRouter = router;


