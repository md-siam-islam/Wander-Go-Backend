
import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";


export const validateTour = (zoodValidate: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log("Request Body:", req.body);
            if (req.body?.data) {
                req.body = JSON.parse(req.body.data);
            }
            req.body = await zoodValidate.parseAsync(req.body)
            console.log(req.body);
            next()

        } catch (error) {
            next(error)
        }

    }