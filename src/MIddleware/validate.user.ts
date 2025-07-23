import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateUser = (zodValidate: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await zodValidate.parseAsync(req.body);
      req.body = parsedData;
      console.log(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
