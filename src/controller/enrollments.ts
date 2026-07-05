import { Request, Response, NextFunction } from "express";

import {
  createEnrollment as createService
} from "../service/enrollments";

import { EnrollmentCreateDTO } from "../constant/enrollments";
import successResponse from "../helper/successResponse";

export const createEnrollment = async (
  req: Request<{}, {}, EnrollmentCreateDTO>,
  res: Response,
  next: NextFunction
) => {
  const {studentId } = req.body;

  try {
    await createService({ studentId })
    
    return res.status(201).json(successResponse(null, "Student enrolled successful"));
  } catch (err) {
    next(err);
  }
}