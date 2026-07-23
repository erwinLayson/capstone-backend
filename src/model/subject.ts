import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import { EditSubjectProps, subjectCreateDTO, subjectResponseDTO, SubjectWithAllTeachersAndClass, techerWithoutThisSubject, allowFields } from "../constant/subject";

export default class Subjects {
  constructor(private connection: PoolConnection) { }
  
  async createSubject(subject: subjectCreateDTO):Promise<number> {
    try {
      const {subjectName , subjectCode, SubjectUnit } = subject;
      const query = "INSERT INTO subjects(name, code, unit) VALUES(?,?,?)";
      const values = [subjectName, subjectCode, SubjectUnit ?? null];

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);

      return result.insertId;
    } catch (err) { 
      throw new InternalServerError("Database operation failed");
    }
  }


  async getAllSubject():Promise<subjectResponseDTO[]> {
    try {
      const query = `
      SELECT
      s.id AS subjectId,
      s.name AS subjectName,
      s.unit AS subjectUnit,
      s.code AS subjectCode,
      c.section AS classSection,
      c.gradeLevel AS classGradeLevel,
      c.id AS classId,
      t.id AS teacherId,
      CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
      FROM subjects s
      LEFT JOIN class_subjects cs
      ON cs.subjectId = s.id
      LEFT JOIN classrooms c
      ON cs.classId = c.id
      LEFT JOIN teachers t
      ON t.id = cs.teacherId
      ORDER BY s.id
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      return (result as subjectResponseDTO[]);
    } catch (err) { 
      throw new InternalServerError("Database operation failed", 500, err);
    }
  };

  async getSubjectByNameAndCode(subejctName: string, subjectCode: string):Promise<subjectResponseDTO | null> {
    try {
      const query = `
        SELECT
        name,
        code,
        unit
        FROM subjects
        WHERE name = ? AND code = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subejctName, subjectCode]);

      if (result.length <= 0) {
        return null;
      }

      return (result[0] as subjectResponseDTO)
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getSubjectByCode(subjectCode: string):Promise<subjectResponseDTO | null> {
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

      return (result[0] as subjectResponseDTO)
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
        c.id AS classId,
        c.section AS classSection,
        c.gradeLevel AS classYearLevel,
        CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
        FROM subjects s
        INNER JOIN class_subjects cs
        ON cs.subjectId = s.id
        INNER JOIN teachers t
        ON t.id = cs.teacherId
        INNER JOIN classrooms c
        ON cs.classId = c.id
        WHERE s.id = ?
      `;
      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subjectId ]);

      return (result as SubjectWithAllTeachersAndClass[])
    } catch (err) { 
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getAllTeacherWithoutThisSubject(subjectId: number):Promise<techerWithoutThisSubject[]> {
    try {
      console.log(subjectId)
      const query = `
      SELECT
      t.id AS teacherId,
      CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
      FROM teachers t
      LEFT JOIN class_subjects cs
      ON cs.teacherId = t.id AND cs.subjectId = ?
      WHERE cs.teacherId IS NULL
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [subjectId]);
      return result as techerWithoutThisSubject[];
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

