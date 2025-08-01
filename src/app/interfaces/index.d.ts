import { jwtJwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request{
            user : jwtJwtPayload
        }
    }
}