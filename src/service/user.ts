import bcrypt from "bcrypt";
import { PoolConnection } from "mysql2/promise";
// config
import { getDBPoolConnection } from "../config/database";

// Constant
import { UserProp } from "../constant/user";

// Model
import UserModel from "../model/user";

// Error handler
import InternalServerError from "../error/internalServerError";
import ValidationError from "../error/validationError";

// Helper 
import checkFields from "../helper/checkFields";

// Create User function
export const createUser = async (user: UserProp, existingConnection?: PoolConnection) => {
    // checking all user fields if valid
  checkFields(user);

    if (!user.email.includes("@")) {
    throw new ValidationError("Please Enter a valid email address");
  }

  const pool = getDBPoolConnection();
  const connection = existingConnection ?? await pool.getConnection();
  const ownConnection = !existingConnection;

  try {
    const userModel = new UserModel(connection);

    const existingUser = await userModel.getUserByEmail(user.email);

    if (existingUser) {
      throw new ValidationError(`User email ${user.email} already exist Use a different email`);
    }
    
    const hashPassword = await bcrypt.hash(user.password.toString(), 10);
    
    const newUserId = await userModel.createUser({ ...user, password: hashPassword });

    return newUserId;
  } catch (err) {
    throw err;
  } finally {
    if (ownConnection) {
      connection.release();
    }
  }
}

export const getAllUsers = async () => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const userModel = new UserModel(connection);

    const users = await userModel.getAllUsers();

    return users;
  } catch (err) {
    throw err
  } finally {
    connection.release();
  }
}