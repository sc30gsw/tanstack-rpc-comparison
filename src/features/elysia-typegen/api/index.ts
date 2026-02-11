import { Result } from "better-result";
import { Elysia } from "elysia";
import type { CreateUserInput, UpdateUserInput } from "~/features/shared/schemas/user";

import { UserService } from "~/features/shared/services/user-service";

const TAG = "Users";

export const userPlugin = new Elysia({ name: "users", prefix: "/users" })
  .get(
    "/",
    async ({ query }) => {
      const limit = query.limit ? Number(query.limit) : undefined;
      const skip = query.skip ? Number(query.skip) : undefined;

      return await UserService.list({ limit, skip });
    },
    {
      detail: {
        description: "ユーザー一覧を取得します（limit/skipでページネーション対応）",
        summary: "ユーザー一覧取得",
        tags: [TAG],
      },
    },
  )
  .get(
    "/search",
    async ({ query }) => {
      return await UserService.search({ q: query.q ?? "" });
    },
    {
      detail: {
        description: "クエリ文字列でユーザーを検索します",
        summary: "ユーザー検索",
        tags: [TAG],
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.getById(Number(params.id)),
      });

      if (result.isOk()) {
        return result.value;
      }

      set.status = 404;
      return result.error;
    },
    {
      detail: {
        description: "指定IDのユーザーを取得します（型推論ベース）",
        summary: "ユーザー取得",
        tags: [TAG],
      },
    },
  )
  .post(
    "/",
    async ({ body }) => {
      return await UserService.create(body as CreateUserInput);
    },
    {
      detail: {
        description: "新しいユーザーを作成します（型推論ベース）",
        summary: "ユーザー作成",
        tags: [TAG],
      },
    },
  )
  .put(
    "/:id",
    async ({ body, params, set }) => {
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.update(Number(params.id), body as UpdateUserInput),
      });

      if (result.isOk()) {
        return result.value;
      }

      set.status = 404;
      return result.error;
    },
    {
      detail: {
        description: "指定IDのユーザーを更新します（型推論ベース）",
        summary: "ユーザー更新",
        tags: [TAG],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.delete(Number(params.id)),
      });

      if (result.isOk()) {
        return result.value;
      }

      set.status = 404;
      return result.error;
    },
    {
      detail: {
        description: "指定IDのユーザーを削除します（型推論ベース）",
        summary: "ユーザー削除",
        tags: [TAG],
      },
    },
  );
