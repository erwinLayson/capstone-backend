import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import {ClassSubjectCreateDTO} from "../constant/classSubject";

export default class ClassSubject {
  constructor(private connection: PoolConnection) { };

  async createClassSubject(classSubject: ClassSubjectCreateDTO): Promise<number> {
    const {classId, teacherId} = classSubject
    try {
      const query = "INSERT INTO class_subjects(classId, teacher_assignment_id) VALUES(?,?)";
      const values = [classId, teacherId]

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);
      
      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  
}