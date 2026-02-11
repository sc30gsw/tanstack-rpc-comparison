import { Tab, Tabs } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import type { FRAMEWORKS } from "~/features/home/constants/framework";
import type { HomeSearchParams } from "~/features/home/schemas/search-schema";

const FRAMEWORK_OPTIONS = [
  { key: "hono", label: "Hono" },
  { key: "orpc", label: "oRPC" },
  { key: "elysia", label: "Elysia" },
  { key: "elysia-typegen", label: "Elysia (TG)" },
  { key: "trpc", label: "tRPC" },
] as const satisfies readonly { key: (typeof FRAMEWORKS)[number]; label: string }[];

export function FrameworkSelector({ framework }: Pick<HomeSearchParams, "framework">) {
  return (
    <Tabs
      aria-label="フレームワーク選択"
      color="primary"
      selectedKey={framework}
      variant="bordered"
    >
      {FRAMEWORK_OPTIONS.map((fw) => (
        <Tab
          key={fw.key}
          title={
            <Link from="/" search={(prev) => ({ ...prev, framework: fw.key, skip: 0 })}>
              {fw.label}
            </Link>
          }
        />
      ))}
    </Tabs>
  );
}
