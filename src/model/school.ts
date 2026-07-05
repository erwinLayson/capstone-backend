import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Error Handler
import InternalServerError from "../error/internalServerError";

// Constant
import {School as SchoolProps, allowFields, updateSchoolInfoProps} from "../constant/school"

export default class School {
  constructor(private connection: PoolConnection) { };

  async createSchoolInfo(school: SchoolProps):Promise<number> {
    try {
      const {schoolId, name, district, division, region } = school;
      const query = "INSERT INTO school_info(schoolId, name, district, division, region) VALUES(?,?,?,?,?)";
      
      const [result] = await this.connection.execute<ResultSetHeader>(query, [schoolId, name, district, division, region]);

      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getSchoolInfo():Promise<SchoolProps | null> {
    try {
      const query = `
        SELECT
        schoolId,
        name,
        district,
        division,
        region
        FROM school_info
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      return result.length <= 0 ? null : (result[0] as SchoolProps);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async updateSchoolInfo(schoolId: number, newSchoolInfo: updateSchoolInfoProps):Promise<number> {
    const updatedFields: string[] = [];
    const updatedValues: (string | number) [] = []

    for (const field of allowFields) {
      const value = newSchoolInfo[field];

      if (value !== undefined) {
        updatedFields.push(`${field} = ?`);
        updatedValues.push(value);
      }
    }

    try {
      const query = `
        UPDATE school_info
        SET ${updatedFields.join(", ")}
        WHERE schoolId = ? 
      `;

      updatedValues.push(schoolId);

      const [result] = await this.connection.execute<ResultSetHeader>(query, updatedValues);

      return result.affectedRows;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
}