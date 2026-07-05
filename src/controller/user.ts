import { Request, Response, NextFunction } from "express";

// constant
import { UserProp} from "../constant/user";

// Service
import {
  createUser as createService,
  getAllUsers as getAllService
} from "../service/user";

// Helper
import successResponse from "../helper/successResponse";

export const createUser = async (req: Request<{}, UserProp>, res: Response, next: NextFunction) => {
  try {
    const result = await createService(req.body);

    if (!result) {
      res.status(500).json("Internal server Error");
      throw new Error(`Something went wrong`);
    }

    return res.status(201).json(successResponse(null, "User created successful"));
  } catch (err) {
    next(err);
  }
}

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllService();
    res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}