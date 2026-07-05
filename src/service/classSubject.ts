import ClassSubjectModel from "../model/classSubject";

// Db pool connection
import { getDBPoolConnection } from "../config/database";

// Helper
import checkFields from "../helper/checkFields";

// constant
import { ClassSubjectCreateDTO } from "../constant/classSubject";

export const createClassSubject = async (classSubject: ClassSubjectCreateDTO) => {
  checkFields(classSubject);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const csModel = new ClassSubjectModel(connection);
    
    const newCsId = await csModel.createClassSubject(classSubject);

    return newCsId;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}