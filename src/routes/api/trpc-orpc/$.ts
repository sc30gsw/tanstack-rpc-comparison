import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { toORPCRouter } from "@orpc/trpc";
import { experimental_ValibotToJsonSchemaConverter as ValibotToJsonSchemaConverter } from "@orpc/valibot";
import { createFileRoute } from "@tanstack/react-router";

import { trpcValibotRouter } from "~/features/trpc/api/valibot-router";

//? tRPC Valibot ルーターを oRPC ルーターに変換して OpenAPI を生成
const orpcRouter = toORPCRouter(trpcValibotRouter);

const handler = new OpenAPIHandler(orpcRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsPath: "/docs",
      schemaConverters: [new ValibotToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          description: "tRPC + Valibot → @orpc/trpc 変換による User API（OpenAPI生成）",
          title: "tRPC User API (via oRPC, Valibot)",
          version: "1.0.0",
        },
        servers: [{ description: "開発サーバー", url: "/api/trpc-orpc" }],
      },
      specPath: "/spec.json",
    }),
  ],
});

export const Route = createFileRoute("/api/trpc-orpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { matched, response } = await handler.handle(request, {
          prefix: "/api/trpc-orpc",
        });

        if (matched) {
          return response;
        }

        return new Response("Not Found", { status: 404 });
      },
    },
  },
});
