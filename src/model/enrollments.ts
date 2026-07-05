import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import { EnrollmentCreateDTO } from "../constant/enrollments";

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
}