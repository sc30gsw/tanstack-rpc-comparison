import { os } from "@orpc/server";
import { Result } from "better-result";
import * as v from "valibot";

import {
  CreateUserSchema,
  DeleteUserResponseSchema,
  ListUsersParamsSchema,
  SearchUsersParamsSchema,
  UpdateUserSchema,
  UserListResponseSchema,
  UserSchema,
} from "~/features/users/schemas/valibot/user";
import { UserService } from "~/features/users/services/user-service";
import { toApiError } from "~/lib/errors";

const base = os.errors({
  BAD_REQUEST: { message: "リクエストが不正です" },
  INTERNAL_SERVER_ERROR: { message: "サーバーエラーが発生しました" },
  NOT_FOUND: { message: "リソースが見つかりません" },
});

export const router = base.router({
  createUser: base
    .route({ method: "POST", path: "/users", summary: "新しいユーザーを作成" })
    .input(CreateUserSchema)
    .output(UserSchema)
    .handler(async ({ errors, input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.create(input),
      });

      return result.match({
        err: () => {
          throw errors.INTERNAL_SERVER_ERROR({
            message: "ユーザーの作成に失敗しました",
          });
        },
        ok: (user) => user,
      });
    }),

  deleteUser: base
    .route({
      method: "DELETE",
      path: "/users/{id}",
      summary: "ユーザーを削除",
    })
    .input(v.object({ id: v.number() }))
    .output(DeleteUserResponseSchema)
    .handler(async ({ errors, input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.delete(input.id),
      });

      return result.match({
        err: () => {
          throw errors.NOT_FOUND({
            message: "削除対象のユーザーが見つかりません",
          });
        },
        ok: (data) => data,
      });
    }),

  getUserById: base
    .route({
      method: "GET",
      path: "/users/{id}",
      summary: "指定IDのユーザーを取得",
    })
    .input(v.object({ id: v.number() }))
    .output(UserSchema)
    .handler(async ({ errors, input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.getById(input.id),
      });

      return result.match({
        err: () => {
          throw errors.NOT_FOUND({
            message: "ユーザーが見つかりません",
          });
        },
        ok: (user) => user,
      });
    }),

  listUsers: base
    .route({
      method: "GET",
      path: "/users",
      summary: "ユーザー一覧を取得",
    })
    .input(ListUsersParamsSchema)
    .output(UserListResponseSchema)
    .handler(async ({ errors, input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.list(input),
      });

      return result.match({
        err: () => {
          throw errors.INTERNAL_SERVER_ERROR({
            message: "ユーザー一覧の取得に失敗しました",
          });
        },
        ok: (data) => data,
      });
    }),

  searchUsers: base
    .route({
      method: "GET",
      path: "/users/search",
      summary: "ユーザーを検索",
    })
    .input(SearchUsersParamsSchema)
    .output(UserListResponseSchema)
    .handler(async ({ errors, input }) => {
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.search(input),
      });

      return result.match({
        err: () => {
          throw errors.INTERNAL_SERVER_ERROR({
            message: "ユーザー検索に失敗しました",
          });
        },
        ok: (data) => data,
      });
    }),

  updateUser: base
    .route({
      method: "PUT",
      path: "/users/{id}",
      summary: "ユーザーを更新",
    })
    .input(
      v.object({
        ...UpdateUserSchema.entries,
        id: v.number(),
      }),
    )
    .output(UserSchema)
    .handler(async ({ errors, input }) => {
      const { id, ...data } = input;
      const result = await Result.tryPromise({
        catch: toApiError,
        try: async () => await UserService.update(id, data),
      });

      return result.match({
        err: () => {
          throw errors.NOT_FOUND({
            message: "更新対象のユーザーが見つかりません",
          });
        },
        ok: (user) => user,
      });
    }),
});
