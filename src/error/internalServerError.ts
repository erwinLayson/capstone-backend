import AppError from './appError';

export default class InternalServerError extends AppError {
  constructor(
    message: string,
    statusCode: number = 500,
    public readonly cause?: unknown
  ) {
    super(message, statusCode);
  }
}