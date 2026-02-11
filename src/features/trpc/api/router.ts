import { TRPCError } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import { Result } from "better-result";
import type { OpenApiMeta } from "trpc-to-openapi";

import {
  CreateUserSchema,
  DeleteUserResponseSchema,
  ListUsersParamsSchema,
  SearchUsersParamsSchema,
  UserListResponseSchema,
  UserSchema,
} from "~/features/users/schemas/zod/user";
import { UserService } from "~/features/users/services/user-service";
import { toApiError } from "~/utils/errors";

//? OpenApiMeta で trpc-to-openapi の OpenAPI メタデータをサポート
export const t = initTRPC.meta<OpenApiMeta>().create();

export const trpcRouter = t.router({
  createUser: t.procedure
    .meta({ openapi: { method: "POST", path: "/users", summary: "新しいユーザーを作成" } })
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

  deleteUser: t.procedure
    .meta({
      openapi: { method: "DELETE", path: "/users/{id}", summary: "ユーザーを削除" },
    })
    .input(UserSchema.pick({ id: true }))
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

  getUsers: t.procedure
    .meta({
      openapi: { method: "GET", path: "/users", summary: "ユーザー一覧を取得" },
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

  getUserById: t.procedure
    .meta({
      openapi: { method: "GET", path: "/users/{id}", summary: "指定IDのユーザーを取得" },
    })
    .input(UserSchema.pick({ id: true }))
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

  searchUsers: t.procedure
    .meta({
      openapi: { method: "GET", path: "/users/search", summary: "ユーザーを検索" },
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

  updateUser: t.procedure
    .meta({
      openapi: { method: "PUT", path: "/users/{id}", summary: "ユーザーを更新" },
    })
    .input(
      UserSchema.pick({
        age: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        id: true,
      }),
    )
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
