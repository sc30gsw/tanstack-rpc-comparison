import type {
  CreateUserInput,
  ListUsersParams,
  SearchUsersParams,
  UpdateUserInput,
  User,
} from "~/features/users/schemas/user";

import {
  DeleteUserResponseSchema,
  UserListResponseSchema,
  UserSchema,
} from "~/features/users/schemas/user";
import { upfetch } from "~/lib/upfetch";

export abstract class UserService {
  static create(data: CreateUserInput) {
    return upfetch("/users/add", { body: data, method: "POST", schema: UserSchema });
  }

  static delete(id: User["id"]) {
    return upfetch(`/users/${id}`, { method: "DELETE", schema: DeleteUserResponseSchema });
  }

  static getById(id: User["id"]) {
    return upfetch(`/users/${id}`, { schema: UserSchema });
  }

  static list(params?: ListUsersParams) {
    return upfetch("/users", { params, schema: UserListResponseSchema });
  }

  static search(params: SearchUsersParams) {
    return upfetch("/users/search", { params, schema: UserListResponseSchema });
  }

  static update(id: User["id"], data: UpdateUserInput) {
    return upfetch(`/users/${id}`, { body: data, method: "PUT", schema: UserSchema });
  }
}
