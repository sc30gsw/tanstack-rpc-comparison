# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

tanstack-rpc-comparison is a project for comparing and verifying RPC/OpenAPI using TanStack Start.

| Category      | Technology                            |
| ------------- | ------------------------------------- |
| Framework     | TanStack Start 1.159.5 / React 19     |
| Build Tool    | Vite 8 Beta                           |
| UI Components | HeroUI 2.8.8 / Tailwind CSS 4         |
| Routing       | TanStack Router (File-based)          |
| RPC/API       | tRPC, oRPC, Hono, Elysia (comparison) |
| Validation    | Valibot                               |
| Linting       | oxlint                                |
| Formatting    | oxfmt                                 |
| Runtime       | Bun                                   |

## Development Commands

```bash
# Development
bun dev              # Start Vite dev server (TanStack Start)

# Code Quality (run before committing)
bun check            # Run oxlint + oxfmt + tsc together
bun fix              # Auto-fix lint and format issues

# Testing
bun test             # Vitest in watch mode
bun test:run         # Vitest single run
bun test:e2e         # Playwright E2E tests
```

## RPC Framework Comparison

| Framework        | Validation   | OpenAPI生成                   | Scalar UI                |
| ---------------- | ------------ | ----------------------------- | ------------------------ |
| tRPC             | Zod v4       | @orpc/trpc 変換               | /api/trpc-openapi/docs   |
| Hono             | Valibot      | hono-openapi                  | /api/hono/docs           |
| Elysia (Runtime) | Valibot      | @elysiajs/openapi             | /api/elysia/docs         |
| Elysia (TypeGen) | TypeScript型 | @elysiajs/openapi (fromTypes) | /api/elysia-typegen/docs |
| oRPC             | Valibot      | @orpc/openapi                 | /api/orpc/docs           |

## Critical Rules (Highest Priority)

### Prohibited Items

- ❌ **Native fetch() usage** (use upfetch from ~/lib/upfetch absolutely)
- ❌ **Excessive use of any type** (use TypeScript Utility types whenever possible)
- ❌ **console.log remaining in production**
- ❌ **Direct description of security keys**
- ❌ **Use of npm/yarn/pnpm** (use bun only)
- ❌ **Zod usage outside tRPC** (tRPC 以外では必ず Valibot を使用すること)

### Security

- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- Environment variables for sensitive data

### Code Quality

- Type safety is the top priority
- Follow immutability patterns (never mutate objects)
- Write code comments in Japanese

## Available Commands

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `/plan`           | Create implementation plan    |
| `/tdd`            | Test-driven development       |
| `/code-review`    | Code quality review           |
| `/build-fix`      | Fix build/type errors         |
| `/e2e`            | E2E test generation/execution |
| `/refactor-clean` | Dead code removal             |
| `/test-coverage`  | Test coverage analysis        |

## Available Agents

| Agent                | Purpose                 | When to Use                   |
| -------------------- | ----------------------- | ----------------------------- |
| planner              | Implementation planning | Complex features, refactoring |
| tdd-guide            | Test-driven development | New features, bug fixes       |
| code-reviewer        | Code quality review     | After writing code            |
| security-reviewer    | Security analysis       | Before commits                |
| build-error-resolver | Fix build errors        | When build fails              |
| e2e-runner           | E2E testing             | Critical user flows           |
| refactor-cleaner     | Dead code cleanup       | Code maintenance              |

### Proactive Agent Usage

- Complex feature requests → Use **planner** agent
- Code just written/modified → Use **code-reviewer** agent
- Bug fix or new feature → Use **tdd-guide** agent
- Before any commit → Use **security-reviewer** agent

## Available Skills

| Skill                         | Description                             |
| ----------------------------- | --------------------------------------- |
| coding-standards              | Project coding conventions              |
| frontend-patterns             | React/TanStack Start frontend patterns  |
| security-review               | Security vulnerability detection        |
| tdd-workflow                  | Test-driven development workflow        |
| tanstack-start-best-practices | TanStack Start performance optimization |

## Additional Information Files

### Project Setup & Commands

@README.md

### Coding Standards (Architecture, Naming, Patterns)

@CODING_GUIDELINES.md

### Rules

@.claude/rules/up-fetch-pattern.md
@.claude/rules/better-result.md
@.claude/rules/coding-style.md
@.claude/rules/git-workflow.md
@.claude/rules/testing.md
@.claude/rules/security.md
@.claude/rules/agents.md

## AI Assistant Instructions (High Priority)

1. **No Testing Required**: This project does not introduce testing, so test-related work is unnecessary
2. **Type Safety Priority**: Prioritize TypeScript type safety above all
3. **Security**: Follow security best practices
4. **Performance**: Always consider performance
5. **Japanese Comments**: Write code comments in Japanese
6. **Design Confirmation**: Always confirm design before implementation
7. **Agent Broswer**: Use agent-broswer as CLI tool instead of Playwright and chrome-devtools MCP when opening broswers because of saving contexts
8. **TanStack MCP**: Use TanStack MCP when asking for something about TanStack or refering to its documents.

### TanStack MCP

The TanStack CLI includes a Model Context Protocol (MCP) server that enables AI assistants to:

- Create TanStack Start projects with add-ons
- Search and fetch TanStack documentation
- Explore the TanStack ecosystem (partners, libraries)

Restart Claude Desktop. Then try:

> "Create a TanStack Start project called 'my-app' with Clerk auth and Drizzle ORM"

Or:

> "How do I use loaders in TanStack Router?"

## Manual Start

```bash
# Stdio (default, for MCP clients)
tanstack mcp

# HTTP/SSE
tanstack mcp --sse
```

## Tools

### Project Creation

| Tool                        | Description                                |
| --------------------------- | ------------------------------------------ |
| `listTanStackAddOns`        | Get available add-ons for project creation |
| `getAddOnDetails`           | Get detailed info about a specific add-on  |
| `createTanStackApplication` | Create a new TanStack Start project        |

### Documentation & Ecosystem

| Tool                      | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `tanstack_list_libraries` | List TanStack libraries with metadata            |
| `tanstack_doc`            | Fetch a documentation page by library and path   |
| `tanstack_search_docs`    | Search documentation via Algolia                 |
| `tanstack_ecosystem`      | Browse ecosystem partners by category or library |

See [Tools Reference](./tools.md) for parameters and examples.
