// Database pool connection
import { getDBPoolConnection } from "../config/database";

// model
import StudentModel from "../model/student";

// service
import { createUser as createUserService} from "./user";

// Helper
import checkFields from "../helper/checkFields";
import getEnv from "../helper/getEnv";

// Error handler
import NotFoundError from "../error/NotFoundError";

// Constant
import { Student, StudentCreateDTO, StudentQuery } from "../constant/student";
import { UserProp, User_role } from "../constant/user";

export const createStudent = async (student: StudentCreateDTO) => {

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();


    const newUser: UserProp = {
      email: student.email,
      password: getEnv("DEFAULT_PASSWORD"),
      role: User_role.STUDENT,
    };

    const newUserId = await createUserService(newUser, connection);
    const studentModel = new StudentModel(connection);

    const newStudentData = {...student, userId: newUserId}

    checkFields(newStudentData);
    const newStudent = await studentModel.createStudent(newStudentData);
    await connection.commit();

    return newStudent;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// get student by ID
export const getStudentById = async (studentId: number) => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection(); 
  try {
    const studentModel = new StudentModel(connection);

    const student = await studentModel.getStudentByStudentId(studentId);

    if (!student) {
      throw new NotFoundError(`No student register in ID: ${studentId}`)
    }

    return student;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}

// get all student functions
export const getAllstudents = async (searchQuery: StudentQuery) => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const studentModel = new StudentModel(connection);
    const students = await studentModel.getAllStudent(searchQuery);

    const studentArray = []

    for (const student of students) {
      for (const [field, value] of Object.entries(student)) {
        if (typeof(value) === "string" && !value.trim()) {
          (student as Record<string, unknown>)[field] = null
        }
      }

      studentArray.push(student);
    }

    return studentArray.map(s => ({
      ...s,
      birthdate: s.birthdate ? new Date(s.birthdate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      }) : s.birthdate
    }))
    
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}