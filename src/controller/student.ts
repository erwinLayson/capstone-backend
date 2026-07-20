import { Request, Response, NextFunction} from "express";

// Constant
import {Student, StudentCreateDTO } from "../constant/student";

// Service
import {
  createStudent as createService,
  getAllstudents as getAllService,
  getStudentById as getByIdService,
} from "../service/student";

// Helper
import successResponse from "../helper/successResponse";
import { stringNormalize } from "../helper/stringNormalize";

export const createStudent = async (
  req: Request<{}, {}, StudentCreateDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      lrn,
      userId,
      email,
      firstname,
      middlename,
      lastname,
      birthdate,
      sex,
      suffix
    } = req.body;

    const studentData = {
      lrn,
      userId,
      email: stringNormalize(email),
      firstname: stringNormalize(firstname), 
      middlename: stringNormalize(middlename),
      lastname: stringNormalize(lastname),
      ...(suffix && {suffix: stringNormalize(suffix)}),
      birthdate,
      sex: stringNormalize(sex)
    }
    
    await createService(studentData)

    return res.status(201).json(successResponse(null, "student created successful"));
  } catch (err) {
    next(err);
  }
}

// get student by ID controller
export const getStudentById = async (req: Request<{studentId: number}>, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params
    const result = await getByIdService(studentId);
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}

// get all student controller
export const getAllstudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = (req.params.search as string) ?? "";
    const pages = Number(req.params.page) || 1
    const limit = Number(req.params.limit) || 10
    const result = await getAllService({ search, pages, limit });
    
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}
