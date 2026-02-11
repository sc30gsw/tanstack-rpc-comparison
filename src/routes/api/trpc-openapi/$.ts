import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { toORPCRouter } from "@orpc/trpc";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";

import { trpcRouter } from "~/features/trpc/api/router";

//? tRPC ルーターを oRPC ルーターに変換して OpenAPI を生成
const orpcRouter = toORPCRouter(trpcRouter);

const handler = new OpenAPIHandler(orpcRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      docsPath: "/docs",
      specGenerateOptions: {
        info: {
          description: "tRPC + Zod v4 → @orpc/trpc 変換による User API（OpenAPI生成）",
          title: "tRPC User API (via oRPC)",
          version: "1.0.0",
        },
        servers: [{ description: "開発サーバー", url: "/api/trpc-openapi" }],
      },
      specPath: "/spec.json",
    }),
  ],
});

export const Route = createFileRoute("/api/trpc-openapi/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { matched, response } = await handler.handle(request, {
          prefix: "/api/trpc-openapi",
        });

        if (matched) {
          return response;
        }

        return new Response("Not Found", { status: 404 });
      },
    },
  },
});
