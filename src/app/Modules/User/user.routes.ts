import { Role } from './user.interface';
import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { createUserZoodSchema } from './user.validate';
import { validateUser } from '../../../MIddleware/validate.user';
import { checkAuth } from '../../../MIddleware/checkAuth';

const router = express.Router()



router.post('/register',validateUser(createUserZoodSchema),UserController.CreateUser)
router.get("/all-users" , checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.AllUser )

export const UserRoutes = router