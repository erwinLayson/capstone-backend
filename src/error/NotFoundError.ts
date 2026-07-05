import AppError from "./appError";

export default class NotFoundError extends AppError {
  constructor(
    message: string,
    statusCode: number = 404
  ) {
    super(message, statusCode)
  }
}