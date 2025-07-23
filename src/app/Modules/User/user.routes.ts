import express from 'express';
import { UserController } from './user.controller';
import { createUserZoodSchema } from './user.validate';
import { validateUser } from '../../../MIddleware/validate.user';

const router = express.Router()



router.post('/register',validateUser(createUserZoodSchema),UserController.CreateUser)
router.get("/all-users" , UserController.AllUser )

export const UserRoutes = router