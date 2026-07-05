import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

// user constant 
import { UserProp, UserResponseDTO } from "../constant/user";

// error handler
import InternalServerError from "../error/internalServerError";

export default class User  {
  constructor(private connection: PoolConnection) { }
  
  async createUser(user: UserProp):Promise<number> {
    try {
      const { email, password, role } = user;

      const query = "INSERT INTO users(email, password, role) VALUE(?,?,?)";

      const [result] = await this.connection.execute<ResultSetHeader>(query, [email, password, role]);

      return result.insertId;
    } catch (err) {
      console.log(err);
      throw new InternalServerError(
        "Database operation failed", 500,
        err
      )
    }
  }

  async getUserByEmail(email: string):Promise<UserProp | null> {
    try {
      const query = "SELECT email, password, role FROM users WHERE email = ?"; 
      const [result] = await this.connection.execute<RowDataPacket[]>(query, [email]);
      
      if (result.length <= 0) {
        return null;
      }

      return (result[0] as UserProp);
    } catch (err) {
      console.log(err);
      throw new InternalServerError(
        "Database operation failed", 500,
        err
      )
    }
  }

  async getAllUsers():Promise<UserResponseDTO[]> {
    try {
      const query: string = "SELECT email, role FROM users";
      const [result] = await this.connection.execute<RowDataPacket[]>(query);

      const users = (result as UserResponseDTO[]);

      return users;
    } catch (err) {
      console.log(err);
      throw new InternalServerError(
        "Database operation failed", 500,
        err
      )
    }
  }
}