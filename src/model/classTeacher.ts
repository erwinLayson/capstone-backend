import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Error handler
import InternalServerError from "../error/internalServerError";

// Constant
import { ClassTeacherCreateDTO, ClassTeacherResponseDTO } from "../constant/classTeacher";

export default class ClassTeacher {
  constructor(private connection: PoolConnection) { };

  async createClassTeacher(classTeacher: ClassTeacherCreateDTO): Promise<number> {
    const { classId, teacherId } = classTeacher;
    try {
      const query = "INSERT INTO class_teacher(teacherId, classId) VALUES(?,?)";
      const values = [teacherId ?? null, classId];

      const [result] = await this.connection.execute<ResultSetHeader>(query, values);
      
      return result.insertId;
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getClassTeacherByClassIdAndTeacherId(classId: number, teacherId: number): Promise<ClassTeacherResponseDTO | null> {
    
    try {
      const query = `
      SELECT
      classId,
      teacherId
      FROM class_teacher
      WHERE classId = ? AND teacherId = ?`;
      const values = [classId, teacherId];

      const [result] = await this.connection.execute<RowDataPacket[]>(query, values);
      
      return result.length <= 0 ? null : (result[0] as ClassTeacherResponseDTO);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
} 