import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Helper 
import getEnv from "../helper/getEnv";

// Error Handler
import ValidationError from "../error/validationError";

// Constant 
import { User } from "../constant/user";

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth_login;

  if (!token) {
    throw new ValidationError("Unauthorized, No Token provided ", 401);
  }

  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET_KEY"));

    req.user = (decoded as User)
    next();
  } catch (err) {
    next();
  }
}