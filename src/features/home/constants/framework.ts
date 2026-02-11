export const FRAMEWORKS = [
  "hono",
  "orpc",
  "elysia",
  "elysia-typegen",
  "trpc",
  "trpc-openapi",
] as const satisfies readonly string[];

export type Framework = (typeof FRAMEWORKS)[number];
