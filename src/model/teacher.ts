import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";  

// Constant
import { TeacherCreateDTO, Teacher, TeachersDTO, TeacherUpdateDTO, allowFields } from "../constant/teacher";

// ErrorHandler
import InternalServerError from "../error/internalServerError";

export default class Teachers {
  constructor(private connection: PoolConnection) {}

  async createTeacher(teacher: TeachersDTO): Promise<number> {
    const {email, firstname, lastname, middlename, suffix, userId } = teacher;
    const insertValue = [email, firstname, lastname, middlename, suffix ?? null, userId]
    try {
      const query = "INSERT INTO teachers(email, firstname, middlename, lastname, suffix, userId) VALUES(?,?,?,?,?,?)";
      const [result] = await this.connection.execute<ResultSetHeader>(query, insertValue);

      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const query = `
        SELECT
        id AS teacherId,
        email,
        CONCAT_WS(" ", firstname, middlename, lastname, suffix) AS fullname
        FROM teachers
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      return (result as Teacher[]);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getTeacherWithNoAdvisory():Promise<{fullname: string, id: number}[]> {
    try {
      const query = `
        SELECT
        t.id AS teacherId,
        CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS fullname
        FROM teachers t
        LEFT JOIN class_teacher ct
        ON t.id = ct.teacherId
        WHERE ct.teacherId IS NULL
      `;
      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      return (result as { fullname: string, id: number }[]);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getTeacherById(teacherId: number): Promise<Teacher | null> {
    try {
      const query = `
        SELECT
        id AS teacherId,
        email,
        CONCAT_WS(" ", firstname, middlename, lastname, suffix) AS fullname
        FROM teachers
        WHERE id = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [teacherId]);

      return result.length <= 0 ? null : (result[0] as Teacher);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async updateTeacherById(taecherId: number, newTeacherinfo: TeacherUpdateDTO): Promise<number> {
    const updatedFields: (string | number)[] = [];
    const updatedValues: (string | number)[] = [];

    for (const field of allowFields) {
      const value = newTeacherinfo[field];
      if (value) {
        updatedFields.push(`${field} = ?`);
        updatedValues.push(value);
      }
    }
    
    try {
      updatedValues.push(taecherId);
      const query = `UPDATE teachers SET ${updatedFields.join(", ")} WHERE id = ?`;
      const [result] = await this.connection.execute<ResultSetHeader>(query, updatedValues);

      return result.affectedRows;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
} 