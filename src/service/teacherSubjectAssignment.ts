import { getDBPoolConnection } from "../config/database";

// Model
import TSAModel from "../model/teacherSubjectAssignment";

// Constant
import { TSACreateDTO } from "../constant/teacherSubjectAssigment";

// Helper
import checkFields from "../helper/checkFields";


import ValidationError from "../error/validationError";


export const createTSA = async (teacherSubject: TSACreateDTO) => {
  checkFields(teacherSubject);
  
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const tsaModel = new TSAModel(connection);

    const TSAExist = await tsaModel.getTSABySubjectIdAndTeacherId(teacherSubject.teacherId, teacherSubject.subjectId);
    if (TSAExist) {
      throw new ValidationError("Teacher already assign in this subject");
    }

    const newTSA = await tsaModel.createTeacherSubjectAssignment(teacherSubject);

    return newTSA
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}