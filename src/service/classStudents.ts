import { getDBPoolConnection } from "../config/database";

import { ClassStudentDTO } from "../constant/classStudent";
import checkFields from "../helper/checkFields";

import ClassStudentModel from "../model/classStudents";


export const createClassStudent = async (classStudent: ClassStudentDTO) => {
  checkFields(classStudent);
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const csModel = new ClassStudentModel(connection);

    const newCsId = await csModel.createStudent(classStudent);
    return newCsId;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}