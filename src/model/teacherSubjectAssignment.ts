import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import {TSACreateDTO, TSAResponseDTO } from "../constant/teacherSubjectAssignment";

export default class TeacherSubejctAssignMent {
  constructor(private connection: PoolConnection) { };

  async createTeacherSubjectAssignment(teacherSubject: TSACreateDTO):Promise<number> {
    try {
      const values = teacherSubject.teacherId.flatMap(id => [
        id, teacherSubject.subjectId
      ]);

      const placeholder = teacherSubject.teacherId.map(() => ("(?, ?)")).join(", ")
      console.log(placeholder)

      const query = `INSERT INTO teacher_subject_assignment(teacherId, subjectId) VALUES ${placeholder}`;

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);

      return result.affectedRows;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getTSABySubjectIdAndTeacherId(
    teacherId: number,
    subjectId: number
  ): Promise<TSAResponseDTO | null> {
    try {
      const query = `
      SELECT
      teacherId,
      subjectId
      FROM teacher_subject_assignment
      WHERE teacherId = ? AND subjectId = ?`;

      const values = [teacherId, subjectId];
      const [result] = await this.connection.execute<RowDataPacket[]>(query, values);

      return result.length <= 0 ? null : (result[0] as TSAResponseDTO);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
}