
import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";


export const validateDivision = (zoodValidate: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log("Validating division data..." , req);
            req.body = JSON.parse(req.body.data) || req.body
            req.body = await zoodValidate.parseAsync(req.body)
            console.log(req.body);
            next()

        } catch (error) {
            next(error) 
        }

    }
