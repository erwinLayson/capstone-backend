import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

import { subjectCreateDTO, subjectResponseDTO } from "../constant/subject";

export default class Subjects {
  constructor(private connection: PoolConnection) { }
  
  async createSubject(subject: subjectCreateDTO):Promise<number> {
    try {
      const { code, name, unit } = subject;
      const query = "INSERT INTO subjects(name, code, unit) VALUES(?,?,?)";
      const values = [name, code, unit ?? null];

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);

      return result.insertId;
    } catch (err) { 
      throw new InternalServerError("Database operation failed");
    }
  }


  async getAllSubject():Promise<subjectResponseDTO[]> {
    try {
      const query = "SELECT name, code unit FROM subjects";

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
}