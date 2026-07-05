import AppError from "./appError";

export default class ValidationError extends AppError {
  constructor(
    message: string,
    statusCode: number = 400
  ) {
    super(message, statusCode);
  }
}