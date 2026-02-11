import { createServerFn } from "@tanstack/react-start";
import { Result } from "better-result";
import * as v from "valibot";

import { homeSearchSchema } from "~/features/home/schemas/search-schema";
import {
  elysiaApi,
  elysiaTypegenApi,
  honoClient,
  orpcClient,
  trpcClient,
  trpcOpenapiClient,
  trpcOrpcClient,
} from "~/lib/rpc-clients";
import { toApiError } from "~/utils/errors";

export const fetchUsers = createServerFn({ method: "GET" })
  .inputValidator(v.pick(homeSearchSchema, ["framework", "limit", "skip"]))
  .handler(async ({ data }) => {
    const { framework, limit, skip } = data;

    const result = await Result.tryPromise({
      catch: toApiError,
      try: async () => {
        switch (framework) {
          case "orpc": {
            return await orpcClient.listUsers({ limit, skip });
          }

          case "trpc": {
            return await trpcClient.getUsers({ limit, skip });
          }

          case "trpc-openapi": {
            return await trpcOpenapiClient.getUsers({ limit, skip });
          }

          case "trpc-orpc": {
            return await trpcOrpcClient.getUsers({ limit, skip });
          }

          case "hono": {
            const res = await honoClient.api.hono.users.$get({
              query: { limit: limit?.toString(), skip: skip?.toString() },
            });

            return await res.json();
          }

          case "elysia": {
            const { data: resData, error } = await elysiaApi.users.get({
              query: { limit, skip },
            });

            if (error) {
              throw error;
            }

            return resData;
          }

          case "elysia-typegen": {
            const { data: resData, error } = await elysiaTypegenApi.users.get({
              query: { limit, skip },
            });

            if (error) {
              throw error;
            }

            return resData;
          }
        }
      },
    });

    return result.match({
      err: (error) => {
        throw new Error(error.message);
      },
      ok: (data) => data,
    });
  });

export const searchUsers = createServerFn({ method: "GET" })
  .inputValidator(v.pick(homeSearchSchema, ["framework", "q"]))
  .handler(async ({ data }) => {
    const { framework, q } = data;

    const result = await Result.tryPromise({
      catch: toApiError,
      try: async () => {
        switch (framework) {
          case "orpc": {
            return await orpcClient.searchUsers({ q });
          }

          case "trpc": {
            return await trpcClient.searchUsers({ q });
          }

          case "trpc-openapi": {
            return await trpcOpenapiClient.searchUsers({ q });
          }

          case "trpc-orpc": {
            return await trpcOrpcClient.searchUsers({ q });
          }

          case "hono": {
            const res = await honoClient.api.hono.users.search.$get({
              query: { q },
            });

            return await res.json();
          }
          case "elysia": {
            const { data: resData, error } = await elysiaApi.users.search.get({
              query: { q },
            });

            if (error) {
              throw error;
            }

            return resData;
          }
          case "elysia-typegen": {
            const { data: resData, error } = await elysiaTypegenApi.users.search.get({
              query: { q },
            });

            if (error) {
              throw error;
            }

            return resData;
          }
        }
      },
    });

    return result.match({
      err: (error) => {
        throw new Error(error.message);
      },
      ok: (data) => data,
    });
  });
