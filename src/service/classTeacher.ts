import ClassTeacherModel from "../model/classTeacher";

// DB Pool connection
import { getDBPoolConnection } from "../config/database";

// Constant
import { ClassTeacherCreateDTO } from "../constant/classTeacher";

// Helper
import checkFields from "../helper/checkFields";

// Error handler
import ValidationError from "../error/validationError";

export const createClassTeacher = async (classTeacher: ClassTeacherCreateDTO) => {
  checkFields(classTeacher);
  
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const ctModel = new ClassTeacherModel(connection);
    
    const newCtId = await ctModel.createClassTeacher(classTeacher);

    return newCtId;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}