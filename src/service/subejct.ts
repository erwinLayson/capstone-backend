import { getDBPoolConnection } from "../config/database";
import SubjectModel from "../model/subject";

import {subjectCreateDTO } from "../constant/subject";
import checkFields from "../helper/checkFields";
import ValidationError from "../error/validationError";

export const createSubject = async (subject: subjectCreateDTO) => {
  checkFields(subject);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const subjectModel = new SubjectModel(connection);

    const subjectExist = await subjectModel.getSubjectByNameAndCode(subject.name, subject.code)
    if (subjectExist) {
      throw new ValidationError("Subject already exist");
    }

    const newSubject = await subjectModel.createSubject(subject);
    return newSubject;
  } catch (err) {
    throw err;
  } finally {
    connection.release()
  }
}