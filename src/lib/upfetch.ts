import { up } from "up-fetch";

/**
 * プロジェクト共通の upfetch インスタンス
 *
 * 設定:
 * - baseUrl: 環境変数から取得 (開発時は相対パス)
 * - timeout: デフォルト 30秒
 * - retry: 自動リトライ設定 (3回、指数バックオフ)
 * - headers: JSON Content-Type
 *
 * 使用例:
 * ```typescript
 * import { upfetch } from '~/lib/upfetch'
 *
 * const data = await upfetch('/api/users', {
 *   schema: v.array(UserSchema)
 * })
 * ```
 */
export const upfetch = up(fetch, () => ({
  // 環境変数からbaseUrlを取得 (未設定時は相対パス)
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",

  headers: {
    "Content-Type": "application/json",
  },

  // デフォルトリトライ設定: 3回、指数バックオフ
  retry: {
    attempts: 3,
    delay: (ctx) => ctx.attempt ** 2 * 1000, // 1s, 4s, 9s
    when: ({ response }) => {
      // リトライ対象: タイムアウト、レート制限、サーバーエラー
      const retryableStatuses = [408, 429, 500, 502, 503, 504];
      return retryableStatuses.includes(response?.status ?? 0);
    },
  },

  // デフォルトタイムアウト: 30秒
  timeout: 30000,
}));
