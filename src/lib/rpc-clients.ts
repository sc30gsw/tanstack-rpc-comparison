import { treaty } from "@elysiajs/eden";
import { createRouterClient } from "@orpc/server";
import { toORPCRouter } from "@orpc/trpc";
import { hc } from "hono/client";
import type { AppType } from "~/routes/api/hono/$";

import { userPlugin as elysiaTypegenPlugin } from "~/features/elysia-typegen/api";
import { userPlugin as elysiaPlugin } from "~/features/elysia/api";
import { router as orpcRouter } from "~/features/orpc/api/router";
import { t, trpcRouter } from "~/features/trpc/api/router";

export const orpcClient = createRouterClient(orpcRouter);

export const trpcCaller = t.createCallerFactory(trpcRouter)({});

//! tRPC OpenAPI: tRPC → oRPC 変換ルーターの直接呼び出し（HTTP なし）
export const trpcOpenapiClient = createRouterClient(toORPCRouter(trpcRouter));

export const honoClient = hc<AppType>("http://localhost:5173");

export const elysiaApi = treaty(elysiaPlugin);
export const elysiaTypegenApi = treaty(elysiaTypegenPlugin);
