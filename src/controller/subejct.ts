import { Request, Response, NextFunction } from "express";

// Constant
import { subjectCreateDTO } from "../constant/subject";

import {
  createSubject as createService
} from "../service/subejct";
import successResponse from "../helper/successResponse";

export const createSubject = async (
  req: Request<{}, {}, subjectCreateDTO>,
  res: Response,
  next: NextFunction
) => {
  const { name, code, unit} = req.body;
  const newSubject = {
    name,
    code,
    ...(unit && { unit })
  }
  try {
    await createService(newSubject);

    return res.status(201).json(successResponse(null, "Subjct created successful"));
  } catch (err) {
    next(err);
  }
}