import { Request, Response, NextFunction } from "express";

// Constant
import { TSACreateDTO } from "../constant/teacherSubjectAssigment";

import {
  createTSA as createService
} from "../service/teacherSubjectAssignment";

// Helper
import successResponse from "../helper/successResponse";

export const createTSA = async (
  req: Request<{}, {}, TSACreateDTO>,
  res: Response,
  next: NextFunction
) => {
  const { subjectId, teacherId} = req.body;

  try {
    await createService({ subjectId, teacherId });

    return res.status(201).json(successResponse(null, "Subject assigned successfull"));
  } catch (err) {
    next(err);
  }
}