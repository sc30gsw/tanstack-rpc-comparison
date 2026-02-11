import type { ORPCMeta } from "@orpc/trpc";
import { TRPCError } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import { Result } from "better-result";
import { pick } from "valibot";

import {
  CreateUserSchema,
  DeleteUserResponseSchema,
  ListUsersParamsSchema,
  SearchUsersParamsSchema,
  UserListResponseSchema,
  UserSchema,
} from "~/features/users/schemas/valibot/user";
import { UserService } from "~/features/users/services/user-service";
import { toApiError } from "~/lib/errors";

//? ORPCMeta で oRPC 変換用の OpenAPI メタデータをサポート（Valibot 版）
export const tv = initTRPC.meta<ORPCMeta>().create();

export const trpcValibotRouter = tv.router({
  createUser: tv.procedure
    .meta({ route: { method: "POST", path: "/users", summary: "新しいユーザーを作成" } })
    .input(CreateUserSchema)
    .output(UserSchema)
    .mutation(async ({ input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.create(input),
      });

      return result.match({
        err: () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ユーザーの作成に失敗しました",
          });
        },
        ok: (user) => user,
      });
    }),

  deleteUser: tv.procedure
    .meta({
      route: { method: "DELETE", path: "/users/{id}", summary: "ユーザーを削除" },
    })
    .input(pick(UserSchema, ["id"]))
    .output(DeleteUserResponseSchema)
    .mutation(async ({ input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.delete(input.id),
      });

      return result.match({
        err: () => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "削除対象のユーザーが見つかりません",
          });
        },
        ok: (data) => data,
      });
    }),

  getUsers: tv.procedure
    .meta({
      route: { method: "GET", path: "/users", summary: "ユーザー一覧を取得" },
    })
    .input(ListUsersParamsSchema)
    .output(UserListResponseSchema)
    .query(async ({ input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.list(input),
      });

      return result.match({
        err: () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ユーザー一覧の取得に失敗しました",
          });
        },
        ok: (data) => data,
      });
    }),

  getUserById: tv.procedure
    .meta({
      route: { method: "GET", path: "/users/{id}", summary: "指定IDのユーザーを取得" },
    })
    .input(pick(UserSchema, ["id"]))
    .output(UserSchema)
    .query(async ({ input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.getById(input.id),
      });

      return result.match({
        err: () => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ユーザーが見つかりません",
          });
        },
        ok: (user) => user,
      });
    }),

  searchUsers: tv.procedure
    .meta({
      route: { method: "GET", path: "/users/search", summary: "ユーザーを検索" },
    })
    .input(SearchUsersParamsSchema)
    .output(UserListResponseSchema)
    .query(async ({ input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.search(input),
      });

      return result.match({
        err: () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ユーザー検索に失敗しました",
          });
        },
        ok: (data) => data,
      });
    }),

  updateUser: tv.procedure
    .meta({
      route: { method: "PUT", path: "/users/{id}", summary: "ユーザーを更新" },
    })
    .input(pick(UserSchema, ["age", "email", "firstName", "lastName", "username", "id"]))
    .output(UserSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.update(id, data),
      });

      return result.match({
        err: () => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "更新対象のユーザーが見つかりません",
          });
        },
        ok: (user) => user,
      });
    }),
});
