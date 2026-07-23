import { PoolConnection } from "mysql2/promise";
import bcrypt from "bcrypt";
import UserModel, { UserProps } from "../model/users.v2";

import { getDBPoolConnection } from "../config/database";
import checkFields from "../helper/checkFields";
import ValidationError from "../error/validationError";


export async function createNewUser_v2(user: UserProps, existingConnection?: PoolConnection) {
  const { email, password, role } = user;
  checkFields({email, password, role})

  const pool = getDBPoolConnection();
  const connection = existingConnection ?? await pool.getConnection();
  const ownconnection = !existingConnection;
  try {
    const userModel = new UserModel(connection);

    const userExist = await userModel.getUserByEmail_v2(email)
    if (userExist) {
      throw new ValidationError(`User email already exist`)
    }

    const passwordHash = await bcrypt.hash(String(user.password), 10);
    const newUserData = {...user, password: passwordHash}

    const newUser = userModel.createUserAccount_v2(newUserData);
    return newUser;
  } finally {
    if (ownconnection) {
      connection.release();
    }
  }
}

export async function getAllUsers_v2() {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();
  try {
    const userModel = new UserModel(connection);

    const users = await userModel.getAllUsers_v2();

    return users;
  } catch (err) {
    throw err
  } finally {
    connection.release();
  }
}