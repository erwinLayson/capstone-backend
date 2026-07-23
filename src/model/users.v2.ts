import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import InternalServerError from "../error/internalServerError";

export type UserProps = {
  email: string,
  password: string,
  role: ROLE
}

export type UserResponse = {
  userId: number
  email: string,
  role: string
}

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student"
} as const;

export type ROLE = (typeof ROLES)[keyof typeof ROLES]

export default class Users {
  constructor(private connection: PoolConnection) { }

  async createUserAccount_v2(user: UserProps):Promise<number> {
    try {
      const { email, password, role } = user;

      const sql = `
        INSERT INTO users(email, password, role) VALUES(?,?,?)
      `;

      const values: (string | number)[] = [email, password, role];

      const [response] = await this.connection.execute<ResultSetHeader>(sql, values);

      return response.insertId;
    } catch (err) {
      throw new InternalServerError(`Internal server error`, 500, err);
    }
  }

  async getUserByEmail_v2(email: string):Promise<UserResponse | null> {
    try {
      const sql = `
        SELECT
        userId,
        email,
        password,
        role
        FROM users
        WHERE email = ?
      `;

      const [response] = await this.connection.execute<RowDataPacket[]>(sql, email);

      if (response.length <= 0) {
        return null
      }

      return response[0] as UserResponse;
    } catch (err) {
      throw new InternalServerError(`Internal server error`, 500, err);
    }
  }

  async getAllUsers_v2():Promise<UserResponse[]> {
    try {
      const sql = `
      SELECT
      userId,
      email,
      role
      FROM users
      `;

      const [response] = await this.connection.execute<RowDataPacket[]>(sql);
      return response as UserResponse[];
    } catch(err) {
      throw new InternalServerError(`Internal server error`, 500, err);
    }
  }
}


