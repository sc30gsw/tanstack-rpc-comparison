import { treaty } from "@elysiajs/eden";
import { createRouterClient } from "@orpc/server";
import { toORPCRouter } from "@orpc/trpc";
import { hc } from "hono/client";
import type { AppType } from "~/routes/api/hono/$";

import { userPlugin as elysiaTypegenPlugin } from "~/features/elysia-typegen/api";
import { userPlugin as elysiaPlugin } from "~/features/elysia/api";
import { router as orpcRouter } from "~/features/orpc/api/router";
import { t, trpcRouter } from "~/features/trpc/api/router";
import { trpcValibotRouter } from "~/features/trpc/api/valibot-router";

export const trpcClient = t.createCallerFactory(trpcRouter)({});
//? tRPC OpenAPI: trpc-to-openapi 経由（Zod v4）— tRPC client で直接呼び出し
export const trpcOpenapiClient = t.createCallerFactory(trpcRouter)({});
//? tRPC oRPC: tRPC Valibot → oRPC 変換ルーターの直接呼び出し（HTTP なし）
export const trpcOrpcClient = createRouterClient(toORPCRouter(trpcValibotRouter));

export const orpcClient = createRouterClient(orpcRouter);

export const honoClient = hc<AppType>(import.meta.env.VITE_APP_URL);

export const elysiaApi = treaty(elysiaPlugin);
export const elysiaTypegenApi = treaty(elysiaTypegenPlugin);
