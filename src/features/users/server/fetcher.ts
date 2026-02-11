import { Result } from "better-result";
import type { Framework } from "~/features/home/constants/framework";
import type { HomeSearchParams } from "~/features/home/schemas/search-schema";

import { toApiError } from "~/lib/errors";
import {
  elysiaApi,
  elysiaTypegenApi,
  honoClient,
  orpcClient,
  trpcCaller,
  trpcOpenapiClient,
} from "~/lib/rpc-clients";

export function fetchUsers({
  framework,
  limit,
  skip,
}: Record<"framework", Framework> & Pick<HomeSearchParams, "limit" | "skip">) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      switch (framework) {
        case "orpc": {
          return await orpcClient.listUsers({ limit, skip });
        }

        case "trpc": {
          return await trpcCaller.getUsers({ limit, skip });
        }

        case "trpc-openapi": {
          return await trpcOpenapiClient.getUsers({ limit, skip });
        }

        case "hono": {
          const res = await honoClient.api.hono.users.$get({
            query: { limit: limit?.toString(), skip: skip?.toString() },
          });

          return await res.json();
        }

        case "elysia": {
          const { data, error } = await elysiaApi.users.get({
            query: { limit, skip },
          });

          if (error) {
            throw error;
          }

          return data;
        }

        case "elysia-typegen": {
          const { data, error } = await elysiaTypegenApi.users.get({
            query: { limit, skip },
          });

          if (error) {
            throw error;
          }

          return data;
        }
      }
    },
  });
}

export function searchUsers({
  framework,
  q,
}: Record<"framework", Framework> & Pick<HomeSearchParams, "q">) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      switch (framework) {
        case "orpc": {
          return await orpcClient.searchUsers({ q });
        }

        case "trpc": {
          return await trpcCaller.searchUsers({ q });
        }

        case "trpc-openapi": {
          return await trpcOpenapiClient.searchUsers({ q });
        }

        case "hono": {
          const res = await honoClient.api.hono.users.search.$get({
            query: { q },
          });

          return await res.json();
        }
        case "elysia": {
          const { data, error } = await elysiaApi.users.search.get({
            query: { q },
          });

          if (error) {
            throw error;
          }

          return data;
        }
        case "elysia-typegen": {
          const { data, error } = await elysiaTypegenApi.users.search.get({
            query: { q },
          });

          if (error) {
            throw error;
          }

          return data;
        }
      }
    },
  });
}
