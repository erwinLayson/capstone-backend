import EnrollmentModel from "../model/enrollments";

import { getDBPoolConnection } from "../config/database";

import { EnrollmentCreateDTO } from "../constant/enrollments";
import checkFields from "../helper/checkFields";
import { PoolConnection } from "mysql2/promise";

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

    const newEnrollmentId = await enrollmentModel.getEnrolledStudentFromClassrooms(classId);

    return newEnrollmentId;
  } catch (err) {
    throw err;
  } finally {
    if (ownConnection) {
      connection.release();
    }
  }
}