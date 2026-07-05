import TeacherModel from "../model/teacher";

// DB Pool connection 
import {getDBPoolConnection } from "../config/database";

// Constant
import {
  TeacherCreateDTO,
  TeacherUpdateDTO
} from "../constant/teacher";
import {
  UserProp as UserCreateDTO,
  User_role
} from "../constant/user";

// Helper
import checkFields from "../helper/checkFields";

// Error Handler
import ValidationError from "../error/validationError";

// Service
import { createUser } from "./user";
import getEnv from "../helper/getEnv";
import NotFoundError from "../error/NotFoundError";


export const createTeacher = async (teacher: TeacherCreateDTO) => {
  if (!teacher.email.includes("@")) {
    throw new ValidationError("Invalid email!, Please enter a valid email ");  
  };

  checkFields(teacher);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const teacherModel = new TeacherModel(connection);

    const newUser: UserCreateDTO = {
      email: teacher.email,
      password: getEnv("DEFAULT_PASSWORD"),
      role: User_role.TEACHER
    }

    const newUserId = await createUser(newUser, connection);

    const newTeacherinfo = {
      ...teacher,
      userId: newUserId
    }

    const newTeacherId = await teacherModel.createTeacher(newTeacherinfo);
    await connection.commit();

    return newTeacherId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export const getAllTeacher = async () => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const teacherModel = new TeacherModel(connection);
    const teachers = await teacherModel.getAllTeachers();
    return teachers
  } finally {
    connection.release();
  }
}


export const updateTeacherById = async (teacherId: number, newTeacherinfo: TeacherUpdateDTO) => {

  // if (!newTeacherinfo.email?.includes("@")) {
  //   throw new ValidationError("Invalid teacher email");
  // }

  checkFields(newTeacherinfo);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const teacherModel = new TeacherModel(connection);

    const teacherExist = teacherModel.getTeacherById(teacherId);

    if (teacherExist === null) {
      throw new NotFoundError("Teacher not found");
    }

    const affectedRows = await teacherModel.updateTeacherById(teacherId, newTeacherinfo);

    return affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}