import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      await schema.parseAsync(
        Object.keys(req.body).length ? req.body : req.cookies
      );
      next();
    } catch (error) {
      next(error);
    }
  };
};
