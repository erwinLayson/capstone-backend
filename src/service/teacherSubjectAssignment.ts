import { getDBPoolConnection } from "../config/database";

// Model
import TSAModel from "../model/teacherSubjectAssignment";

// Constant
import { TSACreateDTO } from "../constant/teacherSubjectAssignment";

import ValidationError from "../error/validationError";


export const createTSA = async (teacherSubject: TSACreateDTO) => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const tsaModel = new TSAModel(connection);

    for (const teacherId of teacherSubject.teacherId) {
      const tsaExist = await tsaModel.getTSABySubjectIdAndTeacherId(teacherId, teacherSubject.subjectId);

      if (tsaExist) {
          throw new ValidationError("Teacher already assign in this subject");
        }
    }
        
    const newTSA = await tsaModel.createTeacherSubjectAssignment(teacherSubject);

    return newTSA
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}