import { Scalar } from "@scalar/hono-api-reference";
import { createFileRoute } from "@tanstack/react-router";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

import { userRoutes } from "~/features/hono/api";

const app = new Hono().basePath("/api/hono");

export const route = app.route("/users", userRoutes);

app.get(
  "/doc",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        description: "Hono + Valibot (hono-openapi) による User API",
        title: "Hono User API",
        version: "1.0.0",
      },
      servers: [{ description: "開発サーバー", url: "/api/hono" }],
    },
  }),
);

app.get("/docs", Scalar({ url: "/api/hono/doc" }));

const handle = ({ request }: Record<"request", Request>) => app.fetch(request);

export const Route = createFileRoute("/api/hono/$")({
  server: {
    handlers: {
      DELETE: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
    },
  },
});

export type AppType = typeof route;
