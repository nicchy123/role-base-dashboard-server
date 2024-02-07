import { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(500).json({
    success: false,
    message: "Route not found!",
  });
}
