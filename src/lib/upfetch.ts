import { up } from "up-fetch";

const DEFAULT_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 30000;

const DUMMY_JSON_BASE_URL = "https://dummyjson.com/";

export const upfetch = up(fetch, () => ({
  baseUrl: DUMMY_JSON_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

  retry: {
    attempts: DEFAULT_ATTEMPTS,
    delay: (ctx) => ctx.attempt ** 2 * 1000, // 1s, 4s, 9s
    when: ({ response }) => {
      const retryableStatuses = [408, 429, 500, 502, 503, 504] as const satisfies number[];

      return retryableStatuses.includes(
        (response?.status as (typeof retryableStatuses)[number]) ?? 0,
      );
    },
  },

  timeout: DEFAULT_TIMEOUT,
}));
