import { Request, Response, NextFunction } from "express";

// Constant
import { ClassTeacherCreateDTO } from "../constant/classTeacher";

// Service
import {
  createClassTeacher as createService
} from "../service/classTeacher";
import successResponse from "../helper/successResponse";

export const createClassTeacher = async (
  req: Request<{}, {}, ClassTeacherCreateDTO>,
  res: Response,
  next: NextFunction
) => {
  const {classId, teacherId } = req.body;
  try {
    await createService({ classId, ...(teacherId !== undefined && { teacherId }) });

    return res.status(201).json(successResponse(null, "Teacher assigned successfull"));
  } catch (err) {
    next(err);
  }
}