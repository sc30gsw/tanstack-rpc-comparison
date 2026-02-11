import { Scalar } from "@scalar/hono-api-reference";
import { createFileRoute } from "@tanstack/react-router";
import { Hono } from "hono";
import { generateSpecs } from "hono-openapi";

import { userRoutes } from "~/features/hono/api";

const app = new Hono().basePath("/api/hono");

app.route("/users", userRoutes);

app.get("/openapi.json", (c) => {
  const spec = generateSpecs(app, {
    documentation: {
      info: {
        description: "Hono + Valibot + hono-openapi による User API",
        title: "Hono User API",
        version: "1.0.0",
      },
      servers: [{ description: "開発サーバー", url: "/api/hono" }],
    },
  });
  return c.json(spec);
});

app.get(
  "/docs",
  Scalar({
    url: "/api/hono/openapi.json",
  }),
);

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
