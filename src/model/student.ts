import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Error handler
import InternalServerError from "../error/internalServerError";

// constant
import { Student, StudentCreateDTO} from "../constant/student";

export default class Students {
  constructor(private connection: PoolConnection) { }
  
  async createStudent(student: StudentCreateDTO):Promise<number> {
    const {userId, lrn, email, firstname, middlename, lastname, suffix, birthdate, sex } = student;
    try { 
      const query = "INSERT INTO students(userId, lrn, email, firstname, middlename, lastname, suffix, birthdate,sex) VALUE(?,?,?,?,?,?,?,?,?)";
      const value = [userId, lrn, email, firstname, middlename, lastname, suffix ?? null, birthdate, sex]
      
      const [result] = await this.connection.execute<ResultSetHeader>(query, value)

      return result.insertId; 
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }

  async getStudentByStudentId(studentId: number): Promise<Student | null> {
    try {
      const query = `
        SELECT
        id AS studentId,
        lrn,
        email,
        CONCAT_WS(" ", firstname, middlename, lastname, suffix) AS fullname,
        birthdate,
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
        sex
        FROM students
        WHERE id = ?
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query, [studentId]);


      return result.length <= 0
        ? null
        : (result[0] as Student);
         
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
   }
  }
  
  async getAllStudent():Promise<Student[]> {
    try {
      const query = `
        SELECT
        id AS studentId,
        lrn
        email,
        CONCAT_WS(" ", firstname, middlename, lastname, suffix) AS fullname,
        birthdate,
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
        sex
        FROM students
      `;

      const [result] = await this.connection.execute<RowDataPacket[]>(query)

      return (result as Student[]);
    } catch (err) {
      throw new InternalServerError("Database operation failed", 500, err);
    }
  }
} 