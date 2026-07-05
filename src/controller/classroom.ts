import { Request, Response, NextFunction } from "express";

// Constant 
import { ClassroomCreateDTO, ClassroomUpdated } from "../constant/classrooms";

// Service
import {
  createClassrooms as createService,
  getAllClassrooms as getAllService,
  updateClassroomById as updateService
 } from "../service/classrooms";
import successResponse from "../helper/successResponse";


export const createClassroom = async (
  req: Request<{}, {}, ClassroomCreateDTO>,
  res: Response,
  next: NextFunction
) => {
  const { section, gradeLevel, adviserId } = req.body;

  try {
    await createService({ section, gradeLevel, ...(adviserId && { adviserId }) })

    return res.status(201).json(
      successResponse(null, "Classroom created successfull")
    );
  } catch (err) {
    next(err);
  }
}

export const getAllClassrooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllService();
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}

export const updateClassroomById = async (req: Request<{classroomId: number}, {}, ClassroomUpdated>, res: Response, next: NextFunction) => {
  const { classroomId } = req.params
  const { classId, section, adviserId, gradeLevel } = req.body;

  const updatedClassInfo = {
    ...(classId && {classId}),
    ...(gradeLevel && {gradeLevel}),
    ...(section && {section}),
    ...(adviserId && {adviserId}),
  }

  try {
    await updateService(classroomId, updatedClassInfo);
    return res.status(201).json(successResponse(null, "Update successfull"))
  } catch (err) {
    next(err);
  }
}