import { Request, Response, NextFunction } from "express";

// Error handler
import InternalServerError from "../error/internalServerError";
import ValidationError from "../error/validationError";
import NotFoundError from "../error/NotFoundError";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);

  if (err instanceof InternalServerError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }


  return res.status(500).json({
    success: false,
    message: err.message,
  });
}