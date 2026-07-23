import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

type StudentsProps = {
  userId: number
  firstname: string
  middlename: string
  lastname: string
  suffix?: string
}

export class Students {
  constructor(private connection: PoolConnection) { }
  
  async createStudent_v2(student: StudentsProps):Promise<number> {
    try {
      const { firstname, middlename, lastname, suffix, userId } = student;
      const sql = "INSERT INTO students(userId, firstname, middlename, lastname, suffix) VALUES(?,?,?,?,?)";
      const values = [userId, firstname, middlename, lastname, suffix ?? null];

      const [response] = await this.connection.execute<ResultSetHeader>(sql, values);

      return response.insertId;
    } catch (err) {
      throw new InternalServerError(`Internal server Error`, 500, err);
    }
  }
}