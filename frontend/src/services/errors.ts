import type { ApiErrorResponse, ApiValidationErrors } from "@/types";
import axios from "axios";

export class ApiError extends Error {
  status?: number;
  errors?: ApiValidationErrors;

  constructor(message: string, status?: number, errors?: ApiValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const toApiError = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message || fallbackMessage;

    return new ApiError(
      message,
      error.response?.status,
      error.response?.data?.errors,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError(fallbackMessage);
};
