import mysql from "mysql2/promise";

// Helper code 
import getEnv from "../helper/getEnv";

export function getDBPoolConnection() {
  const pool = mysql.createPool({
    host: getEnv("DB_HOST"),
    user: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    database: getEnv("DB_DATABASE") 
  })

  return pool;
}


export const checkDBConnection = async () => {
  const pool = getDBPoolConnection();
  try { 
    const connection = await pool.getConnection();
    console.log(`DB Connection success`);

    connection.release();
  } catch (err) {
    console.error("DB Connection failed");
    throw err;
  }
}