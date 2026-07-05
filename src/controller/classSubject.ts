import { Request, Response, NextFunction } from "express";

import { ClassSubjectCreateDTO } from "../constant/classSubject";

import {
  createClassSubject as createService
} from "../service/classSubject";
import successResponse from "../helper/successResponse";

export const createClassSubject = async (req: Request<{}, {}, ClassSubjectCreateDTO>, res: Response, next: NextFunction) => {
  const { classId, teacherId } = req.body;
  try {
    await createService({ classId, teacherId });

    return res.status(201).json(successResponse(null, "Subject added successful"));
  } catch (err) {
    next(err);
  }
}