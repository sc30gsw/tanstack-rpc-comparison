import { Result } from "better-result";
import { Elysia } from "elysia";
import * as v from "valibot";

import {
  CreateUserSchema,
  DeleteUserResponseSchema,
  ListUsersParamsSchema,
  SearchUsersParamsSchema,
  UpdateUserSchema,
  UserListResponseSchema,
  UserSchema,
} from "~/features/users/schemas/user";
import { UserService } from "~/features/users/services/user-service";

const TAG = "Users";

export const userPlugin = new Elysia({ name: "users", prefix: "/users" })
  .get(
    "/",
    async ({ query }) => {
      return await UserService.list({
        limit: query.limit,
        skip: query.skip,
      });
    },
    {
      detail: {
        description: "ユーザー一覧を取得します",
        summary: "ユーザー一覧取得",
        tags: [TAG],
      },
      query: ListUsersParamsSchema,
      response: UserListResponseSchema,
    },
  )
  .get(
    "/search",
    async ({ query }) => {
      return await UserService.search({ q: query.q });
    },
    {
      detail: {
        description: "キーワードでユーザーを検索します",
        summary: "ユーザー検索",
        tags: [TAG],
      },
      query: SearchUsersParamsSchema,
      response: UserListResponseSchema,
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.getById(params.id),
      });

      if (result.isOk()) {
        return result.value;
      }

      set.status = 404;
      return result.error;
    },
    {
      detail: {
        description: "指定IDのユーザーを取得します",
        summary: "ユーザー取得",
        tags: [TAG],
      },
      params: v.pick(UserSchema, ["id"]),
      response: {
        200: UserSchema,
        404: v.object({ message: v.string() }),
      },
    },
  )
  .post(
    "/",
    async ({ body }) => {
      return await UserService.create(body);
    },
    {
      body: CreateUserSchema,
      detail: {
        description: "新しいユーザーを作成します",
        summary: "ユーザー作成",
        tags: [TAG],
      },
      response: UserSchema,
    },
  )
  .put(
    "/:id",
    async ({ body, params, set }) => {
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.update(params.id, body),
      });

      if (result.isOk()) {
        return result.value;
      }

      set.status = 404;
      return result.error;
    },
    {
      body: UpdateUserSchema,
      detail: {
        description: "指定IDのユーザーを更新します",
        summary: "ユーザー更新",
        tags: [TAG],
      },
      params: v.pick(UserSchema, ["id"]),
      response: {
        200: UserSchema,
        404: v.object({ message: v.string() }),
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.delete(params.id),
      });

      if (result.isOk()) {
        return result.value;
      }

      set.status = 404;
      return result.error;
    },
    {
      detail: {
        description: "指定IDのユーザーを削除します",
        summary: "ユーザー削除",
        tags: [TAG],
      },
      params: v.pick(UserSchema, ["id"]),
      response: {
        200: DeleteUserResponseSchema,
        404: v.object({ message: v.string() }),
      },
    },
  );
