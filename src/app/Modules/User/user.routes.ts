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


// user ar reset password ar kaj ta holo frist a user jokhon reset password a click korbe and then tar samne akta form asbe jekhane se tar email dibo. tarpor sei email a akta link chole jabe. oi email a akta button thake oi button ta link thake frontend ar akta router ar shate like a httphttp://localhost:5173/email=""? token  jodi user oi link a click kore tahole se notun password set korte parbe.