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
      s.code AS subjectCode,
      s.unit AS subjectUnit,
      c.id AS classId,
      c.section AS classSection,
      c.gradeLevel AS classGradeLevel,
      t.id AS teacherId,
      CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
      FROM
      subjects s
      LEFT JOIN teacher_subject_assignment tsa
      ON tsa.subjectId = s.id
      LEFT JOIN teachers t
      ON t.id = tsa.teacherId
      LEFT JOIN class_subjects cs
      ON s.id = cs.subjectId
      LEFT JOIN classrooms c
      ON c.id = cs.classId
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
        FROM subejcts
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
        c.id AS classId,
        t.id AS teacherId,
        s.id AS subjectId,
        CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname,
        c.section AS classSection,
        c.gradeLevel AS classYearLevel
        FROM
        teacher_subject_assignment tsa
        INNER JOIN subjects s
        ON s.id = tsa.subjectId
        INNER JOIN teachers t
        ON t.id = tsa.teacherId
        LEFT JOIN class_subjects cs
        ON cs.subjectId = tsa.subjectId
        LEFT JOIN classrooms c
        ON c.id = cs.classId
        WHERE tsa.subjectId = ?
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
      tsa.SubjectId AS subjectId,
      CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS teacherFullname
      FROM
      teachers t
      LEFT JOIN teacher_subject_assignment tsa
      ON t.id = tsa.teacherId AND tsa.subjectId = ?
      WHERE tsa.teacherId IS NULL
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

