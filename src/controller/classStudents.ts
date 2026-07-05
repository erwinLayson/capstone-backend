import { Request, Response, NextFunction } from "express";

import { ClassStudentDTO } from "../constant/classStudent";

import {
  createClassStudent as createService
} from "../service/classStudents";
import successResponse from "../helper/successResponse";

export const createClassStudent = async (
  req: Request<{}, {}, ClassStudentDTO>,
  res: Response,
  next: NextFunction
) => {
  const { classId, enrollmentId } = req.body;
  try {
    await createService({ classId, enrollmentId });
    return res.status(201).json(successResponse(null, "Student added to that class successfull"))
  } catch (err) {
    next(err);
  }
}