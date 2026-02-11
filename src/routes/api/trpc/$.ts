import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { trpcRouter } from "~/features/trpc/api/router";

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      ANY: ({ request }) =>
        fetchRequestHandler({
          createContext: () => ({}),
          endpoint: "/api/trpc",
          req: request,
          router: trpcRouter,
        }),
    },
  },
});
