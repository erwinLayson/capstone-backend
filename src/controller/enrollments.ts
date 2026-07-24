import { Request, Response, NextFunction } from "express";

import {
  createEnrollment as createService,
  getStudentEnrolledByClassId as getStudentByClassService
} from "../service/enrollments";

import { EnrollmentCreateDTO } from "../constant/enrollments";
import successResponse from "../helper/successResponse";
import ValidationError from "../error/validationError";

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

export const getStudentEnrolledByClass = async (
  req: Request<{classId: number}>,
  res: Response,
  next: NextFunction
) => {
  const {classId } = req.params;

  if (!classId) {
    throw new ValidationError(`Invalid classroom ID`)
  }

  try {
    const result = await getStudentByClassService(classId);
    
    return res.status(201).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}