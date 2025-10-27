import { Role } from './user.interface';
import express from 'express';
import { UserController } from './user.controller';
import { createUserZoodSchema, updateUserZoodSchema } from './user.validate';
import { validateUser } from '../../../MIddleware/validate.user';
import { checkAuth } from '../../../MIddleware/checkAuth';

const router = express.Router()

router.post('/register'
    ,validateUser(createUserZoodSchema)
    ,UserController.CreateUser)
router.get("/all-users" , checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.AllUser )
router.get("/me" , checkAuth(...Object.values(Role)), UserController.GetMyProfile )
router.patch('/:id',validateUser(updateUserZoodSchema), checkAuth(...Object.values(Role)), UserController.UpdateUser)

export const UserRoutes = router