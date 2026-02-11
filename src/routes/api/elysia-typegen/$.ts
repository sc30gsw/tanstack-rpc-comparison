import { fromTypes, openapi } from "@elysiajs/openapi";
import { createFileRoute } from "@tanstack/react-router";
import { Elysia } from "elysia";

import { userPlugin } from "~/features/elysia-typegen/api";

const app = new Elysia({ prefix: "/api/elysia-typegen" })
  .use(
    openapi({
      references: fromTypes("src/features/elysia-typegen/api/index.ts"),
      documentation: {
        info: {
          description: "Elysia + TypeScript型ベース生成による User API（型注釈ベース）",
          title: "Elysia User API (TypeGen)",
          version: "1.0.0",
        },
        tags: [{ description: "User CRUD操作", name: "Users" }],
      },
      path: "/docs",
    }),
  )
  .use(userPlugin);

const handle = ({ request }: Record<"request", Request>) => app.fetch(request);

export const Route = createFileRoute("/api/elysia-typegen/$")({
  server: {
    handlers: {
      DELETE: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
    },
  },
});
