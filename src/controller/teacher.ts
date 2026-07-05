import { Request, Response, NextFunction } from "express";

import {
  createTeacher as createService,
  getAllTeacher as getAllService, 
  updateTeacherById as updateService
} from "../service/teacher";

import { TeacherCreateDTO, TeacherUpdateDTO } from "../constant/teacher";
import successResponse from "../helper/successResponse";
import ValidationError from "../error/validationError";

export const createTeacher = async (req: Request<{}, {}, TeacherCreateDTO>, res: Response, next: NextFunction) => {
  try {
    const { email, firstname, lastname, middlename, suffix } = req.body;
    await createService({ email, firstname, middlename, lastname, ...(suffix && { suffix }) })
    return res.status(201).json(successResponse(null, "Teacher created successfull"));
  } catch (err) {
    next(err);
  }
}

export const getAllTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllService();
    return res.status(201).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}

export const updateTeacherById = async (req: Request<{teacherId: number}, {}, TeacherUpdateDTO>, res: Response, next: NextFunction) => {
  try {
    if (!req.params) {
      throw new ValidationError("No teacher ID provided")
    };

    if (req.body === undefined || req.body === null) {
      throw new ValidationError("Cannot update without any chages")
    };

    const { teacherId  } = req.params;
    const { email, firstname, lastname, middlename, suffix } = req.body;

    const newTeacherInfo = {
      ...(email && {email}),
      ...(firstname && {firstname}),
      ...(middlename && {middlename}),
      ...(lastname && {lastname}),
      ...(lastname && {lastname}),
      ...(suffix && {suffix}),
    }

    await updateService(teacherId, newTeacherInfo)
    return res.status(201).json(
      successResponse(null, "Update successfull")
    )
  } catch (err) {
    next(err);
  }
}