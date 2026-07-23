import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import InternalServerError from "../error/internalServerError";

import { ClassroomCreateDTO, Classroom, ClassroomUpdated, allowedFields } from "../constant/classrooms";
import ValidationError from "../error/validationError";

export default class Classrooms {
  constructor(private connection: PoolConnection) { };

  async createClassrooms(classroom: ClassroomCreateDTO ):Promise<number> {
    try {
      const {  gradeLevel, section} = classroom;
      const query = "INSERT INTO classrooms(section, gradeLevel) VALUES(?,?)";
      const value = [section, gradeLevel]
      
      const [result] = await this.connection.execute<ResultSetHeader>(query, value);

      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getAllClassrooms():Promise<Classroom[]> {
    try {
      const query = `
        SELECT
        c.id AS classId,
        c.section,
        c.gradeLevel,
        CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS adviserName,
        t.id AS teacherId
        FROM classrooms c
        LEFT JOIN class_teacher ct
        ON ct.classId = c.id
        LEFT JOIN teachers t
        ON t.id = ct.teacherId
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      return (result as Classroom[]);
    } catch (err) {
      throw new InternalServerError("Database Operation Failed", 500, err);
    }
  }

  async getClassroomById(classroomId: number):Promise<Classroom | null> {
    try {
      const query = `
        SELECT
        id AS classId,
        section,
        gradeLevel
        FROM classrooms
        WHERE id = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [classroomId]);

      if (result.length <= 0) {
        return null
      }

      return (result[0] as Classroom);
    } catch (err) {
      throw new InternalServerError("Database Operation Failed", 500, err);
    }
  }

async getClassroomBySectionAndGradeLevel(section: string, gradeLevel: number):Promise<Classroom | null> {
    try {
      const query = `
        SELECT
        id AS classId,
        section,
        gradeLevel
        FROM classrooms
        WHERE section = ? AND gradeLevel = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [section, gradeLevel]);

      if (result.length <= 0) {
        return null
      }

      return (result[0] as Classroom);
    } catch (err) {
      throw new InternalServerError("Database Operation Failed", 500, err);
    }
  }

  async updateClassroomsById(classroomId: number, newClassInfo: ClassroomUpdated): Promise<number> {

    const updatedFields: string[] = [];
    const updatedValues: (string | number)[] = [];

    for (const field of allowedFields) {
      const value = newClassInfo[field];

      if (value !== undefined) {
        updatedFields.push(`${field} = ?`);
        updatedValues.push(value);
      }
    }

    try {
      const query = `UPDATE classrooms SET ${updatedFields.join(", ")} WHERE id = ?`;
      updatedValues.push(classroomId);

      const [result] = await this.connection.execute<ResultSetHeader>(query, updatedValues);

      return result.affectedRows;
    } catch (err) {
      throw new InternalServerError("Database Operation Failed", 500, err);
    }
  }
}

