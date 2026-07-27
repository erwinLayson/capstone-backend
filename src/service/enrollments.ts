import EnrollmentModel from "../model/enrollments";

import { getDBPoolConnection } from "../config/database";

import { EnrollmentCreateDTO } from "../constant/enrollments";
import checkFields from "../helper/checkFields";
import { PoolConnection } from "mysql2/promise";
import { getSubjectByClassroom } from "./subjects";

export const createEnrollment = async (enrollments: EnrollmentCreateDTO) => {
  checkFields(enrollments);
  const pool =  getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const enrollmentModel = new EnrollmentModel(connection);

    const newEnrollmentId = await enrollmentModel.createEnrollments(enrollments);

    return newEnrollmentId;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}


export const getStudentEnrolledByClassId = async (classId: number, existingConnection?: PoolConnection) => {
  const pool = getDBPoolConnection();
  const connection = existingConnection ?? await pool.getConnection();
  const ownConnection = !existingConnection;
  try {

    const enrollmentModel = new EnrollmentModel(connection);

    const classroomStudents = await enrollmentModel.getEnrolledStudentFromClassrooms(classId);
    const classroomSubjects = await getSubjectByClassroom(classId);
    
    const classroomArr = {
        students: [...classroomStudents],
        subjects: [...classroomSubjects]
      }
    

    return classroomArr;
  } catch (err) {
    throw err;
  } finally {
    if (ownConnection) {
      connection.release();
    }
  }
}

export const getClassroomByGradeLevel = async (gradeLevel: number, existingConnection?: PoolConnection) => {
  const pool = getDBPoolConnection();
  const connection = existingConnection ?? await pool.getConnection();
  const ownConnection = !existingConnection;
  try {

    const enrollmentModel = new EnrollmentModel(connection);

    const classrooms = await enrollmentModel.getClassroomsByGradeLevel(gradeLevel);

    if (!classrooms) {
      return 
    }

    return classrooms;
  } catch (err) {
    throw err;
  } finally {
    if (ownConnection) {
      connection.release();
    }
  }
}

export const getClassroomGroupByGradeLevel = async (existingConnection?: PoolConnection) => {
  const pool = getDBPoolConnection();
  const connection = existingConnection ?? await pool.getConnection();
  const ownConnection = !existingConnection;
  try {

    const enrollmentModel = new EnrollmentModel(connection);

    const classrooms = await enrollmentModel.getAllClassroomGroupByGradeLevel();

    return classrooms;
  } catch (err) {
    throw err;
  } finally {
    if (ownConnection) {
      connection.release();
    }
  }
}


// Unused service
export const getEnrolledStudentByClassroomId = async (classrommId: number) => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {

    const enrollmentModel = new EnrollmentModel(connection);
    const students = await enrollmentModel.getStudentByClassroomId(classrommId);

  } finally {
    connection.release();
  }
}