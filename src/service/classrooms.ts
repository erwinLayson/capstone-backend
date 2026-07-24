import ClassroomModel from "../model/classrooms";
import ClassTeacher from "../model/classTeacher";

// Db pool connection
import { getDBPoolConnection } from "../config/database";

// Service
import { getStudentEnrolledByClassId } from "./enrollments";
import {getSubjectByClassroom} from "./subjects"

// Helper 
import checkFields from "../helper/checkFields";

// Constant 
import { ClassroomCreateDTO, ClassroomUpdated } from "../constant/classrooms";

// Error handler
import ValidationError from "../error/validationError";
import NotFoundError from "../error/NotFoundError";

export const createClassrooms = async (classroom: ClassroomCreateDTO) => {
  checkFields(classroom);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const classModel = new ClassroomModel(connection);
    const ctModel = new ClassTeacher(connection);

    const classExist = await classModel.getClassroomBySectionAndGradeLevel(classroom.section, classroom.gradeLevel);

    if (classExist) {
      throw new ValidationError(`Section ${classExist.section} already exist in Grade-${classExist.gradeLevel}`);
    }

    const newClassroom = await classModel.createClassrooms(classroom);

    await ctModel.createClassTeacher({ classId: newClassroom, ...(classroom.adviserId && {teacherId: classroom.adviserId})})
    await connection.commit();

    return newClassroom;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}

export const getAllClassrooms = async () => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const classModel = new ClassroomModel(connection);
    const classrooms = await classModel.getAllClassrooms();
    return classrooms;
  }finally {
    connection.release(); 
  }
}

export const getClassroomById = async (classroomId: number) => {
  if (!classroomId) {
    throw new ValidationError("Invalid classroom ID provided");
  }

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const classModel = new ClassroomModel(connection);
    const classrooms = await classModel.getClassroomById(classroomId);
    const student = await getStudentEnrolledByClassId(classroomId, connection);
    const subject = await getSubjectByClassroom(classroomId, connection);

    if (classrooms === null) {
      throw new NotFoundError("No classroom found");
    }
    const classroomArr = {
      ...classrooms,
      students: [...student],
      subjects: [...subject]
    }

    return classroomArr;
  } catch (err) {
    throw err
  } finally {
    connection.release();
  }
}

export const updateClassroomById = async (classroomId: number, newClassInfo: ClassroomUpdated) => {
  if (!classroomId) {
    throw new ValidationError("Invalid classroom ID provided", 400);
  }

  if (Object.entries(newClassInfo).length <= 0) {
    throw new ValidationError("Required atleast one field to update");
  }

  checkFields(newClassInfo);

  // DB
  const pool = getDBPoolConnection(); 
  const connection = await pool.getConnection();
  try {
    let classExist: unknown = {}

    const classModel = new ClassroomModel(connection);

    if (newClassInfo.section && newClassInfo.gradeLevel) {
      classExist = await classModel.getClassroomBySectionAndGradeLevel(newClassInfo.section, newClassInfo.gradeLevel)
    };

    if (classExist) {
      throw new ValidationError(`Section ${newClassInfo.section} already exist in Grade-${newClassInfo.gradeLevel}`);
    }

    const affectedRows = await classModel.updateClassroomsById(classroomId, newClassInfo);

    return affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}