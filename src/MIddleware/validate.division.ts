
import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";


export const validateDivision = (zoodValidate : AnyZodObject) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = await zoodValidate.parseAsync(req.body)
            req.body = parsedData
            console.log(req.body);
            next()
            
        } catch (error) {
            next(error)
        }

    }
