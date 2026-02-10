import type { ValidationError } from "up-fetch";

/**
 * API エラー型定義
 */
export type ApiError = {
  code: string;
  message: string;
  status?: number;
};

/**
 * upfetch のエラーを ApiError に変換
 *
 * 変換対象:
 * - ValidationError (スキーマ検証失敗)
 * - TimeoutError (タイムアウト)
 * - HTTP エラー (4xx, 5xx)
 * - その他の不明なエラー
 */
export function toApiError(error: unknown): ApiError {
  // ValidationError (スキーマバリデーション失敗)
  if (isValidationError(error)) {
    return {
      code: "VALIDATION_ERROR",
      message: "入力データが不正です",
      status: 400,
    };
  }

  // TimeoutError
  if (error instanceof Error && error.name === "TimeoutError") {
    return {
      code: "TIMEOUT",
      message: "リクエストがタイムアウトしました",
      status: 408,
    };
  }

  // HTTP errors (ResponseError)
  if (isResponseError(error)) {
    return {
      code: `HTTP_${error.response?.status}`,
      message: error.message || "サーバーエラーが発生しました",
      status: error.response?.status,
    };
  }

  // Unknown errors
  return {
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "エラーが発生しました",
  };
}

/**
 * ValidationError 判定
 */
function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as ValidationError).issues)
  );
}

/**
 * ResponseError 判定
 */
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
