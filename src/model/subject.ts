import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import { EditSubjectProps, subjectCreateDTO, subjectResponseDTO, SubjectWithAllTeachersAndClass, teacherWithoutThisSubject, allowFields, SubjectsProps } from "../constant/subject";

export default class Subjects {
  constructor(private connection: PoolConnection) { }
  
  async createSubject(subject: subjectCreateDTO):Promise<number> {
    try {
      const { subjectName, subjectCode, subjectUnit } = subject;
      const query = "INSERT INTO subjects(name, code, unit) VALUES(?,?,?)";
      const values = [subjectName, subjectCode, subjectUnit ?? null];

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);

      return result.insertId;
    } catch (err) { 
      throw new InternalServerError("Database operation failed");
    }
  }


  async getAllSubject() {
    try {
      const query = `
      SELECT
      s.id AS subjectId,
      s.name AS subjectName,
      s.unit AS subjectUnit,
      s.code AS subjectCode,
      COUNT(DISTINCT cs.classId) AS totalClassrooms,
      COUNT(DISTINCT tsa.teacherId) AS totalTeachers
      FROM subjects s
      LEFT JOIN class_subjects cs
      ON cs.subjectId = s.id
      LEFT JOIN teacher_subject_assignment tsa
      ON tsa.subjectId = s.id
      GROUP BY
      s.id,
      s.name,
      s.unit,
      s.code
      ORDER BY s.id
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      return (result as SubjectsProps[]);
    } catch (err) { 
      throw new InternalServerError("Database operation failed", 500, err);
    }
  };

  async getSubjectByNameAndCode(subjectName: string, subjectCode: string): Promise<{ name: string, code: string, unit: number } | null> {
    try {
      const query = `
        SELECT
        name,
        code,
        unit
        FROM subjects
        WHERE name = ? AND code = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subjectName, subjectCode]);

      if (result.length <= 0) {
        return null;
      }

      return (result[0] as { name: string, code: string, unit: number })
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getSubjectByCode(subjectCode: string): Promise<{ name: string, code: string, unit: number } | null> {
    try {
      const query = `
        SELECT
        name,
        code,
        unit
        FROM subjects
        WHERE code = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subjectCode]);

      if (result.length <= 0) {
        return null;
      }

      return (result[0] as { name: string, code: string, unit: number })
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getSubjectWithAllAssignedTeacher(subjectId: number):Promise<SubjectWithAllTeachersAndClass[]> {
    try {
      const query = `
        SELECT
        s.id AS subjectId,
        t.id AS teacherId,
        CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
        FROM subjects s
        INNER JOIN teacher_subject_assignment tsa
        ON tsa.subjectId = s.id
        INNER JOIN teachers t
        ON t.id = tsa.teacherId
        WHERE s.id = ?
      `;
      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subjectId ]);

      return (result as SubjectWithAllTeachersAndClass[])
    } catch (err) { 
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getAllTeacherWithoutThisSubject(subjectId: number):Promise<teacherWithoutThisSubject[]> {
    try {
      console.log(subjectId)
      const query = `
      SELECT
      t.id AS teacherId,
      CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
      FROM teachers t
      LEFT JOIN teacher_subject_assignment tsa
      ON tsa.teacherId = t.id AND tsa.subjectId = ?
      WHERE tsa.teacherId IS NULL
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subjectId]);
      return result as teacherWithoutThisSubject[];
    } catch (err) { 
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }


  async updateSubjectById(subjectId: number, newSubjectData: EditSubjectProps): Promise<number> {
    try {
      const subject = {
        name: newSubjectData.subjectName,
        code: newSubjectData.subjectCode,
        unit: newSubjectData.subjectUnit
      }
      const updatedFields: string[] = []
      const updatedValues: (string | number)[] = []

      console.log(newSubjectData)

      for (const field of allowFields) {
        const value = subject[field]

        if (value !== undefined) {
          updatedFields.push(`${field} = ?`);
          updatedValues.push(value)
        }
      }
      const query = `UPDATE subjects SET ${updatedFields} WHERE id = ?`;
      updatedValues.push(subjectId);

      const [result] = await this.connection.execute<ResultSetHeader>(query,updatedValues)

      return result.affectedRows
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
}

