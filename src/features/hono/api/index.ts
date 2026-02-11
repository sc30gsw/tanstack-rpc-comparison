import { Result } from "better-result";
import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { pick } from "valibot";

import { MessageSchema } from "~/features/hono/api/model";
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

export const userRoutes = new Hono()
  .get(
    "/",
    describeRoute({
      description: "ユーザー一覧を取得します",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: resolver(UserListResponseSchema),
            },
          },
          description: "ユーザー一覧",
        },
      },
      tags: [TAG],
    }),
    validator("query", pick(ListUsersParamsSchema, ["limit", "skip"])),
    async (c) => {
      const { limit, skip } = c.req.valid("query");

      const result = await UserService.list({
        limit,
        skip,
      });

      return c.json(result);
    },
  )
  .get(
    "/search",
    describeRoute({
      description: "クエリ文字列でユーザーを検索します",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: resolver(UserListResponseSchema),
            },
          },
          description: "検索結果",
        },
      },
      tags: [TAG],
    }),
    validator("query", pick(SearchUsersParamsSchema, ["q"])),
    async (c) => {
      const { q } = c.req.valid("query");

      const result = await UserService.search({ q });

      return c.json(result);
    },
  )
  .get(
    "/:id",
    describeRoute({
      description: "指定IDのユーザーを取得します",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: resolver(UserSchema),
            },
          },
          description: "ユーザー",
        },
        404: {
          content: {
            "application/json": {
              schema: resolver(MessageSchema),
            },
          },
          description: "ユーザーが見つかりません",
        },
      },
      tags: [TAG],
    }),
    async (c) => {
      const id = Number(c.req.param("id"));

      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.getById(id),
      });

      if (result.isOk()) {
        return c.json(result.value);
      }

      return c.json(result.error, 404);
    },
  )
  .post(
    "/",
    describeRoute({
      description: "新しいユーザーを作成します",
      responses: {
        201: {
          content: {
            "application/json": {
              schema: resolver(UserSchema),
            },
          },
          description: "作成されたユーザー",
        },
      },
      tags: ["Users"],
    }),
    validator("json", CreateUserSchema),
    async (c) => {
      const input = c.req.valid("json");
      const result = await UserService.create(input);

      return c.json(result, 201);
    },
  )
  .put(
    "/:id",
    describeRoute({
      description: "指定IDのユーザーを更新します",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: resolver(UserSchema),
            },
          },
          description: "更新されたユーザー",
        },
        404: {
          content: {
            "application/json": {
              schema: resolver(MessageSchema),
            },
          },
          description: "ユーザーが見つかりません",
        },
      },
      tags: [TAG],
    }),
    validator("json", UpdateUserSchema),
    async (c) => {
      const id = Number(c.req.param("id"));
      const input = c.req.valid("json");
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.update(id, input),
      });

      if (result.isOk()) {
        return c.json(result.value);
      }

      return c.json(result.error, 404);
    },
  )
  .delete(
    "/:id",
    describeRoute({
      description: "指定IDのユーザーを削除します",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: resolver(DeleteUserResponseSchema),
            },
          },
          description: "削除成功",
        },
        404: {
          content: {
            "application/json": {
              schema: resolver(MessageSchema),
            },
          },
          description: "ユーザーが見つかりません",
        },
      },
      tags: [TAG],
    }),
    async (c) => {
      const id = Number(c.req.param("id"));
      const result = await Result.tryPromise({
        catch: () => ({ message: "ユーザーが見つかりません" }),
        try: async () => await UserService.delete(id),
      });

      if (result.isOk()) {
        return c.json(result.value);
      }

      return c.json(result.error, 404);
    },
  );
