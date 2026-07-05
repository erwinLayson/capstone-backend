type SuccessResponse<T> = {
  success: boolean,
  message: string,
  data?: T | null
}


export default function successResponse<T>(
  data?: T | null,
  message: string = "Transaction successful",
  ):SuccessResponse<T> {
  return {
    success: true,
    message,
    ...(data && {data})
  }
}