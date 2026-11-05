import { HeroUIProvider, Spinner } from "@heroui/react";
import {
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorComponent,
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      { charSet: "utf8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "TanStack Start Start" },
    ],
  }),
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponent,
});

function RootComponent() {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <HeroUIProvider>
          <Outlet />
        </HeroUIProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">404</h1>
      <p>ページが見つかりませんでした。</p>
    </div>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-600">エラー</h1>
      <p>{error instanceof Error ? error.message : String(error)}</p>
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="flex justify-center py-12">
      <Spinner label="読み込み中..." />
    </div>
  );
}
