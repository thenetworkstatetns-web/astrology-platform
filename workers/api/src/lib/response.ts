import type { ApiResponse } from "@astro/types";

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status = 400, code = "BAD_REQUEST", details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Not found"): AppError {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409, "CONFLICT");
  }

  static internal(message = "Internal server error"): AppError {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }
}

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function fail(message: string, code: string, details?: unknown): ApiResponse<never> {
  return {
    success: false,
    error: { message, code, details },
  };
}
