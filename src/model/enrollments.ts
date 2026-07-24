import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import { EnrollmentCreateDTO } from "../constant/enrollments";

// Constant
import { Student } from "../constant/student";

export default class Enrollments {
  constructor(private connection: PoolConnection) { };

  async createEnrollments(enrollments: EnrollmentCreateDTO): Promise<number> {
    const { studentId } = enrollments;
    try {
      const query = "INSERT INTO enrollments(studentId) VALUES(?)";
      const values = [studentId];

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);

      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }


  async getEnrolledStudentFromClassrooms(classId: number):Promise<Student[]> {
    try {
      const query = `
        SELECT
        s.lrn AS studentLrn,
        s.id AS studentId,
        s.email AS studentEmail,
        s.sex AS studentGender,
        CONCAT_WS(" ", s.firstname, s.middlename, s.lastname, s.suffix) AS studentFullname
        FROM
        enrollments e
        LEFT JOIN classrooms c
        ON c.id = e.classId
        LEFT JOIN students s
        ON s.id = e.studentId
        WHERE c.id = ?
      `;

      const [response] = await this.connection.execute<RowDataPacket[]>(query, [classId]);

      return response as Student[];
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
}