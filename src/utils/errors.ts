import type { ClientErrorStatusCode, ServerErrorStatusCode } from "hono/utils/http-status";
import type { ValidationError } from "up-fetch";

type StatusCode = ClientErrorStatusCode | ServerErrorStatusCode;

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
  response?: Record<"status", StatusCode>;
} {
  return (
    error instanceof Error &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  );
}

type ApiError = {
  code: "VALIDATION_ERROR" | "TIMEOUT" | `HTTP_${StatusCode}` | "UNKNOWN_ERROR";
  message: string;
  status?: StatusCode;
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
      code: `HTTP_${error.response?.status as StatusCode}`,
      message: error.message || "サーバーエラーが発生しました",
      status: error.response?.status as StatusCode,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "エラーが発生しました",
  };
}
