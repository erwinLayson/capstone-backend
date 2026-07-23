import { getDBPoolConnection } from "../config/database";
import SubjectModel from "../model/subject";

import {subjectCreateDTO, EditSubjectProps,SubjectsProps } from "../constant/subject";
import checkFields from "../helper/checkFields";
import ValidationError from "../error/validationError";

export const createSubject = async (subject: subjectCreateDTO) => {
  checkFields(subject);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const subjectModel = new SubjectModel(connection);

    const subjectExist = await subjectModel.getSubjectByNameAndCode(subject.subjectName, subject.subjectCode)
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

export async function updateSubjectById(subjectId: number, newSubjectData: EditSubjectProps) {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const subjectModel = new SubjectModel(connection);
    const updateResponse = await subjectModel.updateSubjectById(subjectId, newSubjectData)

    return updateResponse;
  } finally {
    connection.release();
  }
}

export const getAllSubjects = async () => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const subjectModel = new SubjectModel(connection);
    const subjects = await subjectModel.getAllSubject();

    const subjectMap = new Map<number, SubjectsProps>();

    for (const subject of subjects) {
      if (!subjectMap.has(subject.subjectId)) {
        subjectMap.set(subject.subjectId, {
          subjectId: subject.subjectId,
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          subjectUnit: Number(subject.subjectUnit),
          teacher: [],
          class: []
        })
      }

      const current = subjectMap.get(subject.subjectId);

      if (subject.teacherId !== null) {
        current?.teacher.push({
          teacherId: subject.teacherId,
          teacherFullname: subject.teacherFullname
        })
      }

      if (subject.classId !== null) {
        current?.class.push({
        classId: subject.classId,
        classGradeLevel: subject.classGradeLevel,
        classSection: subject.classSection
      })
      }

    }

    return Array.from(subjectMap.values())
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}

export const getSubjectWithAllTeacherAndClass = async (subjectId: number) => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const subjectModel = new SubjectModel(connection);
    const result = subjectModel.getSubjectWithAllAssignedTeacher(subjectId);
    return result;
  } finally {
    connection.release();
  }
}


export const getTeacherWithouThisSubject = async (subjectId: number) => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const subjectModel = new SubjectModel(connection);
    const result = subjectModel.getAllTeacherWithoutThisSubject(subjectId);
    return result;
  } finally {
    connection.release();
  }
}