import { createFileRoute } from "@tanstack/react-router";
import { createOpenApiFetchHandler, generateOpenApiDocument } from "trpc-to-openapi";

import { trpcRouter } from "~/features/trpc/api/router";

const openApiDocument = generateOpenApiDocument(trpcRouter, {
  baseUrl: "/api/trpc-openapi",
  title: "tRPC User API (via trpc-to-openapi)",
  version: "1.0.0",
});

const SCALAR_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <title>tRPC User API (via trpc-to-openapi) - Scalar</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <script id="api-reference" data-url="/api/trpc-openapi/spec.json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

export const Route = createFileRoute("/api/trpc-openapi/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const url = new URL(request.url);
        const subPath = url.pathname.replace("/api/trpc-openapi", "");

        if (subPath === "/spec.json") {
          return Response.json(openApiDocument);
        }

        if (subPath === "/docs") {
          return new Response(SCALAR_HTML, {
            headers: { "Content-Type": "text/html" },
          });
        }

        return createOpenApiFetchHandler({
          endpoint: "/api/trpc-openapi",
          req: request,
          router: trpcRouter,
        });
      },
    },
  },
});
