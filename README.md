# TanStack RPC Comparison

[TanStack Start](https://tanstack.com/start) 上で RPC/OpenAPI フレームワーク（tRPC, oRPC, Hono, Elysia）の比較・検証を行うプロジェクトです。

## Tech Stack

| Category      | Technology                                                                             | Version      |
| ------------- | -------------------------------------------------------------------------------------- | ------------ |
| Framework     | [TanStack Start](https://tanstack.com/start) / [React](https://react.dev/)             | 1.159.5 / 19 |
| Build Tool    | [Vite](https://vite.dev/)                                                              | 8 Beta       |
| UI Components | [HeroUI](https://www.heroui.com/) / [Tailwind CSS](https://tailwindcss.com/)           | 2.8.8 / 4    |
| Routing       | [TanStack Router](https://tanstack.com/router) (File-based)                            | 1.159.5      |
| RPC/API       | tRPC, oRPC, Hono, Elysia (比較用)                                                      | -            |
| Validation    | [Valibot](https://valibot.dev/)（tRPC のみ [Zod](https://zod.dev/) v4）                | -            |
| Language      | [TypeScript Native](https://devblogs.microsoft.com/typescript/typescript-native-port/) | 7 Preview    |
| Linter        | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                       | Latest       |
| Formatter     | [oxfmt](https://oxc.rs/docs/guide/usage/formatter)                                     | Latest       |
| Git Hooks     | [Lefthook](https://github.com/evilmartians/lefthook)                                   | Latest       |
| Runtime       | [Bun](https://bun.sh/)                                                                 | Latest       |

## RPC Framework Comparison

各フレームワークの API エンドポイントと OpenAPI ドキュメント（Scalar UI）の URL:

| Framework        | Validation   | OpenAPI 生成                  | Docs URL                 |
| ---------------- | ------------ | ----------------------------- | ------------------------ |
| tRPC             | Zod v4       | @orpc/trpc 変換               | /api/trpc-openapi/docs   |
| Hono             | Valibot      | hono-openapi                  | /api/hono/docs           |
| Elysia (Runtime) | Valibot      | @elysiajs/openapi             | /api/elysia/docs         |
| Elysia (TypeGen) | TypeScript型 | @elysiajs/openapi (fromTypes) | /api/elysia-typegen/docs |
| oRPC             | Valibot      | @orpc/openapi                 | /api/orpc/docs           |

## Project Structure

Bulletproof React に基づくフィーチャーベースの構成です。

```
src/
  features/          # フレームワーク別・機能別実装
    elysia/          # Elysia (Runtime Validation)
    elysia-typegen/  # Elysia (TypeGen)
    hono/            # Hono
    orpc/            # oRPC
    trpc/            # tRPC
    home/            # ホーム画面 UI
    users/           # ユーザー共通ロジック・スキーマ
  routes/            # TanStack Router（ファイルベース）
    api/             # 各 RPC のマウントポイント
  lib/               # 共通ユーティリティ（upfetch, errors 等）
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) をインストールしてください

### Installation

```bash
# リポジトリをクローン
git clone https://github.com/sc30gsw/tanstack-rpc-comparison.git
cd tanstack-rpc-comparison

# 依存関係をインストール（git hooks は自動セットアップ）
bun install

# 開発サーバーを起動
bun dev
```

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `bun dev`      | 開発サーバーを起動                   |
| `bun build`    | プロダクションビルド                 |
| `bun start`    | プロダクションビルドのプレビュー     |
| `bun check`    | oxlint (type-aware) + oxfmt チェック |
| `bun fix`      | lint 自動修正 + フォーマット         |
| `bun lint`     | oxlint のみ実行                      |
| `bun lint:fix` | oxlint の自動修正のみ                |
| `bun fmt`      | oxfmt チェックのみ                   |
| `bun fmt:fix`  | oxfmt でフォーマット実行             |

## VS Code Configuration

### Recommended Extension

[oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) のインストールを推奨します。

### Editor Settings

`.vscode/settings.json` で以下を設定しています:

- **Format on Save**: 保存時に oxfmt で自動フォーマット
- **Read-only Files**: 以下のファイルは誤編集防止のため読み取り専用
  - `**/*.md` — Markdown は AI 管理想定
  - `bun.lock` — 自動生成のロックファイル
  - `**/routeTree.gen.ts` — TanStack Router の自動生成ファイル

## About oxlint Configuration

`.oxlintrc.json` では以下の設定を使用しています:

- **Plugins**: react, react-perf, import, jsx-a11y, promise
- **Categories**: `correctness` を error
- **Rules**: `no-default-export` を error（`src/router.tsx`, `vite.config.ts`, `src/lib/hero.ts` は override で off）
- **Ignore**: `**/routeTree.gen.ts`

より厳しくする場合は `categories` や `rules` を追加してください。利用可能な categories: `correctness`, `suspicious`, `perf`, `style`, `pedantic`, `restriction`, `nursery`

## Git Hooks with Lefthook

[Lefthook](https://github.com/evilmartians/lefthook) で git hooks を管理しています:

- **pre-commit**: ステージされたファイルに対して lint と format チェックを並列実行
- **pre-push**: プッシュ前に `bun run check` を実行

`bun install` 時に hooks が自動でインストールされます。

## Developer Tools

- **TanStack Router DevTools**: 開発モードでルート・ナビゲーションのデバッグ用パネルが右下に表示されます
- **Scalar UI**: 各 RPC の OpenAPI ドキュメントは上記「RPC Framework Comparison」の Docs URL から参照できます

## Coding Guidelines

詳細は [CODING_GUIDELINES.md](CODING_GUIDELINES.md) を参照してください。

### 要点

- **プロジェクト構造**: [Bulletproof React](https://github.com/alan2207/bulletproof-react) の Feature-based 構成。`~` エイリアスでのインポート必須（相対パス禁止）
- **型定義**: `as const satisfies` パターン、Single Source of Truth、基本的に `type` を使用。Props は TypeScript Utility 型（`Record`, `Pick`, `Omit` 等）を積極活用
- **コードスタイル**: Node Style Guide 準拠（2スペース、シングルクォート、セミコロンなし）。Named Export・関数宣言スタイル
- **HTTP リクエスト**: ネイティブ `fetch()` 禁止。[up-fetch](https://github.com/L-Blondy/up-fetch)（`~/lib/upfetch`）を必ず使用
- **エラーハンドリング**: [better-result](https://github.com/dmmulroy/better-result) を使用。`match` パターンで分岐
- **バリデーション**: tRPC 以外では [Valibot](https://valibot.dev/) を使用（tRPC のみ Zod v4）
- **AHA Programming**: 早すぎる抽象化を避け、重複を許容してから共通化を検討
- **TanStack Start**: Server Functions（`.functions.ts`）、サーバールートは `createFileRoute` の `server.handlers` で外部フレームワークをマウント

## Claude / AI 開発環境

このリポジトリでは `.claude/` 以下で Claude（AI アシスタント）向けのルール・エージェント・スキルを定義しています。全体像は [CLAUDE.md](CLAUDE.md) を参照してください。

### ルール（.claude/rules/）

| ルール           | 内容                                   |
| ---------------- | -------------------------------------- |
| up-fetch-pattern | upfetch による HTTP リクエストパターン |
| better-result    | Result 型を用いたエラーハンドリング    |
| coding-style     | コーディングスタイル・命名規則         |
| git-workflow     | コミット・PR のワークフロー            |
| security         | セキュリティ方針                       |
| testing          | テスト方針                             |
| agents           | エージェントの役割と使い分け           |

### エージェント（.claude/agents/）

| エージェント         | 用途             | 使うタイミング               |
| -------------------- | ---------------- | ---------------------------- |
| planner              | 実装計画         | 複雑な機能・リファクタリング |
| tdd-guide            | TDD              | 新機能・バグ修正             |
| code-reviewer        | コードレビュー   | コード記述後                 |
| security-reviewer    | セキュリティ分析 | コミット前                   |
| build-error-resolver | ビルドエラー解消 | ビルド失敗時                 |
| e2e-runner           | E2E テスト       | 重要フローの検証             |
| refactor-cleaner     | デッドコード削除 | 保守・整理                   |

### スキル（.claude/skills/）

プロジェクト固有のスキルとして、コーディング規約・フロントエンドパターン・セキュリティレビュー・TDD ワークフロー・TanStack Start ベストプラクティス・agent-browser 等を利用できます。

### 利用可能なコマンド（スラッシュコマンド）

| コマンド          | 説明                 |
| ----------------- | -------------------- |
| `/plan`           | 実装プラン作成       |
| `/tdd`            | テスト駆動開発       |
| `/code-review`    | コード品質レビュー   |
| `/build-fix`      | ビルド・型エラー修正 |
| `/e2e`            | E2E テスト生成・実行 |
| `/refactor-clean` | デッドコード削除     |
| `/test-coverage`  | テストカバレッジ分析 |

## License

MIT License - 詳細は [LICENSE](LICENSE.md) を参照してください。
