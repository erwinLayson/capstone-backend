import { Request, Response, NextFunction } from "express";

// Constant
import { subjectCreateDTO, EditSubjectProps } from "../constant/subject";

import {
  createSubject as createService,
  getAllSubjects as getAllService,
  getSubjectWithAllTeacherAndClass,
  getTeacherWithouThisSubject,
  updateSubjectById
} from "../service/subjects";
import successResponse from "../helper/successResponse";
import ValidationError from "../error/validationError";
import { stringNormalize } from "../helper/stringNormalize";

export const createSubject = async (
  req: Request<{}, {}, subjectCreateDTO>,
  res: Response,
  next: NextFunction
) => {
  const { subjectName, subjectCode, SubjectUnit} = req.body;
  const newSubject = {
    subjectName: stringNormalize(subjectName),
    subjectCode: stringNormalize(subjectCode),
    ...(SubjectUnit && { SubjectUnit })
  }
  try {
    await createService(newSubject);

    return res.status(201).json(successResponse(null, "Subjct created successful"));
  } catch (err) {
    next(err);
  }
}

export const updateSubject = async (req: Request<{subjectId: number}, {}, EditSubjectProps>, res: Response, next: NextFunction) => {
  try {
    const { subjectId } = req.params;
    const {subjectCode, subjectName, subjectUnit} = req.body

    const newSubjectData = {
      ...(subjectCode && {subjectCode: stringNormalize(subjectCode)}),
      ...(subjectName && {subjectName: stringNormalize(subjectName)}),
      ...(subjectUnit && {subjectUnit})
    }

    if (subjectId == null || subjectId === undefined) {
      throw new ValidationError(`Invalid update`)
    }

    for(const [field, value] of Object.entries(newSubjectData)) {
      if(value === " ") {
        throw new ValidationError(`Missing ${field} field are required`)
      }
    }

    await updateSubjectById(subjectId, newSubjectData);
    return res.status(201).json(successResponse(null, `Update successfull`))
  }catch(err) {
    next(err);
  }
}

export const getAllSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllService();
    return res.status(200).json(successResponse(result));
  }catch(err) {
    next(err);
  }
}

export const getAllSubjectWithAllTeacherAndClass = async (req: Request<{subjectId: number}>, res: Response, next: NextFunction) => {
  const { subjectId } = req.params;

  if(!subjectId) throw new ValidationError("Invalid subject Id")
  try {
    const result = await getSubjectWithAllTeacherAndClass(subjectId);
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}


export const getAllTeacherWithiutThisSubject = async (req: Request<{subjectId: number}>, res: Response, next: NextFunction) => {
  const { subjectId } = req.params;

  if(!subjectId) throw new ValidationError("Invalid subject Id")
  try {
    const result = await getTeacherWithouThisSubject(subjectId);
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}