import { Request, Response, NextFunction } from "express";

import successResponse from "../helper/successResponse";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    return res.status(200).json(successResponse(user, "authencated"));
  } catch (err) {
    next();
  }
}