import { openapi } from "@elysiajs/openapi";
import { createFileRoute } from "@tanstack/react-router";
import { Elysia } from "elysia";

import { userPlugin } from "~/features/elysia/api";

const app = new Elysia({ prefix: "/api/elysia" })
  .use(
    openapi({
      documentation: {
        info: {
          description: "Elysia + Valibot (Runtime Schema) による User API",
          title: "Elysia User API (Runtime)",
          version: "1.0.0",
        },
        tags: [{ description: "User CRUD操作", name: "Users" }],
      },
      path: "/docs",
    }),
  )
  .use(userPlugin);

const handle = ({ request }: Record<"request", Request>) => app.fetch(request);

export const Route = createFileRoute("/api/elysia/$")({
  server: {
    handlers: {
      DELETE: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
    },
  },
});
