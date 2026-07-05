import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import { ClassStudentDTO } from "../constant/classStudent";

export default class ClassStudent {
  constructor(private connection: PoolConnection) { };

  async createStudent(classStudent: ClassStudentDTO): Promise<number> {
    const { classId, enrollmentId } = classStudent;
    try { 
      const query = "INSERT INTO class_students(classId, enrollmentId) VALUES(?,?)";
      const values = [classId, enrollmentId];

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);

      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
}