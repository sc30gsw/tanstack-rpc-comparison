import {
  Avatar,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Link } from "@tanstack/react-router";
import type { User, UserListResponse } from "~/features/shared/schemas/user";

const COLUMNS = [
  { key: "avatar", label: "" },
  { key: "name", label: "名前" },
  { key: "email", label: "Email" },
  { key: "company", label: "会社" },
  { key: "age", label: "年齢" },
] as const satisfies readonly { key: keyof User | "avatar" | "name"; label: string }[];

export function UserTable({ limit, skip, total, users }: UserListResponse) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-4">
      <Table aria-label="ユーザー一覧">
        <TableHeader>
          {COLUMNS.map((col) => (
            <TableColumn key={col.key}>{col.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="ユーザーが見つかりません">
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar alt={`${user.firstName} ${user.lastName}`} size="sm" src={user.image} />
              </TableCell>
              <TableCell>
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <p className="text-xs text-default-400">@{user.username}</p>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.company.name}</TableCell>
              <TableCell>{user.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={currentPage}
            total={totalPages}
            renderItem={({ page, ...props }) => (
              <Link from="/" search={(prev) => ({ ...prev, skip: (page - 1) * limit })} {...props}>
                {page}
              </Link>
            )}
          />
        </div>
      )}
    </div>
  );
}
