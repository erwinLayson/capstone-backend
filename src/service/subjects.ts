import { getDBPoolConnection } from "../config/database";
import SubjectModel from "../model/subject";

import {subjectCreateDTO, EditSubjectProps,SubjectsProps } from "../constant/subject";
import checkFields from "../helper/checkFields";
import ValidationError from "../error/validationError";
import { PoolConnection } from "mysql2/promise";

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

    return subjects;
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


export const getSubjectByClassroom = async (classId: number, existingConnection?: PoolConnection) => {
  const pool = getDBPoolConnection();
  const connection = existingConnection ?? await pool.getConnection();
  const ownConnection = !existingConnection;
  try {
    const subjectModel = new SubjectModel(connection);
    const result = subjectModel.getSubjectByClassroom(classId);
    return result;
  } finally {
    if (ownConnection) {
      connection.release();
    }
  }
}