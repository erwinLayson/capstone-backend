import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { getDBPoolConnection } from "../config/database";
import { Request, Response, NextFunction } from "express";
import successResponse from "../helper/successResponse";

class Testing {
  constructor(private connection: PoolConnection) { }
  
  async postTest<dataType extends Record<string, string>>(data: dataType, tableName: string):Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const placeholder = columns.map(() => " ?").join(",")
    const query = `INSERT INTO ${tableName}(${columns.join(", ")}) VALUES(${placeholder})`;
    const [result] = await this.connection.execute<ResultSetHeader>(query, values);

    return result.insertId;
  }


  async getTest<T>():Promise<T[]> {
   
    const query = `
    SELECT
    CONCAT_WS(" ", t.firstname, t.middlename, t.lastname, t.suffix) AS adviserName
    FROM teachers t
    LEFT JOIN classrooms c
    ON c.adviserId = t.id
    WHERE c.adviserId IS NULL
    `;
    const [result] = await this.connection.execute<RowDataPacket[]>(query);

    return (result as T[]);
  }

}


type GetFunction = {
  fullname: string
}

export async function getTestingFunction(req: Request, res: Response, next: NextFunction) {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const testModel = new Testing(connection);
    const response = await testModel.getTest<GetFunction>();
    console.log(response);

    return res.status(200).json(successResponse(response))
  } catch (err) {
    next(err);
  }
} 