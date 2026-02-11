import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { experimental_ValibotToJsonSchemaConverter as ValibotToJsonSchemaConverter } from "@orpc/valibot";
import { createFileRoute } from "@tanstack/react-router";

import { router } from "~/features/orpc/api/router";

const handler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsPath: "/docs",
      schemaConverters: [new ValibotToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          description: "oRPC + Valibot による User API",
          title: "oRPC User API",
          version: "1.0.0",
        },
        servers: [{ description: "開発サーバー", url: "/api/orpc" }],
      },
      specPath: "/spec.json",
    }),
  ],
});

export const Route = createFileRoute("/api/orpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { matched, response } = await handler.handle(request, {
          prefix: "/api/orpc",
        });

        if (matched) {
          return response;
        }

        return new Response("Not Found", { status: 404 });
      },
    },
  },
});
