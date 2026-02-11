import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spinner,
} from "@heroui/react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";

import { FrameworkSelector } from "~/features/home/components/framework-selector";
import { UserSearchInput } from "~/features/home/components/user-search-input";
import { UserTable } from "~/features/home/components/user-table";
import { defaultValues, homeSearchSchema } from "~/features/home/schemas/search-schema";
import { fetchUsers, searchUsers } from "~/features/users/server/fetcher";

export const Route = createFileRoute("/")({
  validateSearch: homeSearchSchema,
  loaderDeps: ({ search: { framework, limit, q, skip } }) => ({
    framework,
    limit,
    q,
    skip,
  }),
  search: {
    middlewares: [stripSearchParams(defaultValues)],
  },
  loader: async ({ deps }) => {
    const result = deps.q
      ? await searchUsers({ data: { framework: deps.framework, q: deps.q } })
      : await fetchUsers({
          data: { framework: deps.framework, limit: deps.limit, skip: deps.skip },
        });

    return result;
  },
  component: Home,
  pendingComponent: () => (
    <div className="flex justify-center py-12">
      <Spinner label="読み込み中..." />
    </div>
  ),
});

const FRAMEWORK_CARDS = [
  {
    color: "primary",
    description: "hono-openapi で OpenAPI 自動生成。Valibot でバリデーション。",
    docsUrl: "/api/hono/docs",
    name: "Hono",
    openapi: "hono-openapi",
    validation: "Valibot",
  },
  {
    color: "secondary",
    description: "@orpc/openapi で OpenAPI 生成。Standard Schema 対応で Valibot を直接利用。",
    docsUrl: "/api/orpc/docs",
    name: "oRPC",
    openapi: "@orpc/openapi",
    validation: "Valibot",
  },
  {
    color: "success",
    description: "@elysiajs/openapi プラグイン。Valibot を Standard Schema 経由で利用。",
    docsUrl: "/api/elysia/docs",
    name: "Elysia (Runtime)",
    openapi: "@elysiajs/openapi",
    validation: "Valibot",
  },
  {
    color: "warning",
    description: "TypeScript 型からの OpenAPI 生成。スキーマ定義不要の型ベースアプローチ。",
    docsUrl: "/api/elysia-typegen/docs",
    name: "Elysia (TypeGen)",
    openapi: "@elysiajs/openapi (fromTypes)",
    validation: "TypeScript型",
  },
  {
    color: "danger",
    description: "tRPC ネイティブ RPC プロトコル。fetchRequestHandler で直接処理。",
    docsUrl: "/api/trpc-openapi/docs",
    name: "tRPC (Native)",
    openapi: "なし（RPC専用）",
    validation: "Zod v4",
  },
  {
    color: "danger",
    description: "tRPC + Zod v4 → @orpc/trpc で oRPC に変換して OpenAPI を生成。",
    docsUrl: "/api/trpc-openapi/docs",
    name: "tRPC (OpenAPI)",
    openapi: "@orpc/trpc 変換",
    validation: "Zod v4",
  },
] as const satisfies readonly {
  color: "danger" | "primary" | "secondary" | "success" | "warning";
  description: string;
  docsUrl: `/api/${string}/docs`;
  name: string;
  openapi: string;
  validation: "Valibot" | "TypeScript型" | "Zod v4";
}[];

export function Home() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">RPC Framework Comparison</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            TanStack Start 上で各 RPC フレームワークの OpenAPI + Scalar UI を比較検証
          </p>
        </header>

        <div className="mb-6 flex justify-center">
          <FrameworkSelector framework={search.framework} />
        </div>

        <div className="mb-6 flex justify-center">
          <UserSearchInput />
        </div>

        <div className="mb-12">
          {data.users ? (
            <UserTable
              limit={search.limit}
              skip={search.skip}
              total={data.total}
              users={data.users}
            />
          ) : (
            <div className="flex justify-center py-12">
              <Spinner label="読み込み中..." />
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FRAMEWORK_CARDS.map((fw) => (
            <Card key={fw.name} className="border-none shadow-md" isPressable>
              <CardHeader className="flex flex-col items-start gap-2 pb-0">
                <h2 className="text-xl font-semibold">{fw.name}</h2>
                <div className="flex gap-2">
                  <Chip color={fw.color} size="sm" variant="flat">
                    {fw.validation}
                  </Chip>
                  <Chip size="sm" variant="bordered">
                    {fw.openapi}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 dark:text-gray-400">{fw.description}</p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link
                  className="text-sm font-medium"
                  color={fw.color}
                  href={fw.docsUrl}
                  isExternal
                  showAnchorIcon
                >
                  Scalar UI を開く
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
