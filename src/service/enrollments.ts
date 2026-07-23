import EnrollmentModel from "../model/enrollments";

import { getDBPoolConnection } from "../config/database";

import { EnrollmentCreateDTO } from "../constant/enrollments";
import checkFields from "../helper/checkFields";

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