import type { ClientErrorStatusCode, ServerErrorStatusCode } from "hono/utils/http-status";
import type { ValidationError } from "up-fetch";

function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as ValidationError).issues)
  );
}

function isResponseError(error: unknown): error is {
  message: string;
  response?: { status: number };
} {
  return (
    error instanceof Error &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  );
}

export type ApiError = {
  code:
    | "VALIDATION_ERROR"
    | "TIMEOUT"
    | `HTTP_${ClientErrorStatusCode | ServerErrorStatusCode}`
    | "UNKNOWN_ERROR";
  message: string;
  status?: ClientErrorStatusCode | ServerErrorStatusCode;
};

export function toApiError(error: unknown): ApiError {
  if (isValidationError(error)) {
    return {
      code: "VALIDATION_ERROR",
      message: "入力データが不正です",
      status: 400,
    };
  }

  if (error instanceof Error && error.name === "TimeoutError") {
    return {
      code: "TIMEOUT",
      message: "リクエストがタイムアウトしました",
      status: 408,
    };
  }

  if (isResponseError(error)) {
    return {
      code: `HTTP_${error.response?.status as ClientErrorStatusCode | ServerErrorStatusCode}`,
      message: error.message || "サーバーエラーが発生しました",
      status: error.response?.status as ClientErrorStatusCode | ServerErrorStatusCode,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "エラーが発生しました",
  };
}
