import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Model 
import UserModel from "../model/user";

// DB Pool Connection
import { getDBPoolConnection } from "../config/database";

// Error handler 
import ValidationError from "../error/validationError";

// Helper
import getEnv from "../helper/getEnv";

// Main function start 

export default async function LoginAuthentication(req: Request<{}, {}, {email: string, password: string}>, res: Response) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ValidationError("Please fill up all fields");
  }

  if (!email.includes("@")) {
    throw new ValidationError("Enter a valid Email Address");
  }

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const userModel = new UserModel(connection);

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      throw new ValidationError(`User with email ${email} are not registered!`)
    }

    const passwordVerify = await bcrypt.compare(password.toString(), user.password);

    if (!passwordVerify) {
      throw new ValidationError("Incorrect Password");
    }

    const token = jwt.sign({ email, role: user.role }, getEnv("JWT_SECRET_KEY"), { expiresIn: "1h" });

    res.cookie("auth_login", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful"
    });

  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({
        success: false, 
        message: err.message
      })
    }

    throw err;
  } finally {
    connection.release();
  }
}

