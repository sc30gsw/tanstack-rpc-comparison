# Coding Style

> Project-specific coding conventions and code review guidelines.
> See also: `CLAUDE.md`, `CODING_GUIDELINES.md`, `.claude/rules/better-result.md`

## CRITICAL Priority Rules

### better-result Pattern (Highest Priority)

**API Layer (mutations.ts) Pattern:**

```typescript
// ✅ GOOD: Result.tryPromise - keys must be alphabetical (catch → try)
export function createUser(params: CreateUserParams) {
  return Result.tryPromise({
    catch: toApiError,  // catch must come first
    try: async () => {
      const response = await apiClient.users.$post({ body: params })
      return response.body
    },
  })
}

// ❌ BAD: Wrong key order
return Result.tryPromise({
  try: async () => { ... },  // try first is NOT allowed
  catch: toApiError,
})
```

**Hook Layer (use-\*.ts) Pattern:**

```typescript
// ✅ GOOD: result.match() - keys must be alphabetical (err → ok)
result.match({
  err: (error) => {
    showError({ message: error.message, title: 'Error' })
  },
  ok: (data) => {
    showSuccess({ message: 'Success' })
    onSuccess(data)
  },
})

// ❌ BAD: if/return pattern is FORBIDDEN (prone to bugs from forgetting return)
if (result.isErr()) {
  showError({...})
  // Missing return → ok handler executes even on error
}
showSuccess({...})
onSuccess()
```

**Forbidden Patterns:**

- Wrapping Result with try/catch (Result doesn't throw, so it's meaningless)
- Forgetting return after `if (result.isErr())`
- Redundant async keyword usage (functions returning Result.tryPromise don't need async)

---

### Immutability (CRITICAL)

Direct object mutation is absolutely forbidden.

```typescript
// ❌ BAD: Direct mutation
function updateUser(user, name) {
  user.name = name; // MUTATION!
  return user;
}

users.push(newUser); // MUTATION!
user.roles[0] = "admin"; // MUTATION!

// ✅ GOOD: Create new objects
function updateUser(user, name) {
  return {
    ...user,
    name,
  };
}

const updatedUsers = [...users, newUser];
const updatedUser = { ...user, roles: [...user.roles, "admin"] };
```

---

## HIGH Priority Rules

### Aggressive TypeScript Utility Type Usage

**For 1-2 properties, use Utility types directly instead of defining dedicated types:**

```typescript
// ❌ BAD: Dedicated type for 1 property
type ContainerProps = {
  children: ReactNode
}
export function Container({ children }: ContainerProps) { ... }

// ✅ GOOD: Use Record
export function Container({ children }: Record<'children', ReactNode>) { ... }

// ❌ BAD: New type definition when derivable from existing type
type UserNameProps = {
  name: string
  email: string
}

// ✅ GOOD: Derive with Pick
export function UserCard(props: Pick<User, 'name' | 'email'>) { ... }

// ✅ GOOD: Compose multiple types
export function UserCard(
  props: Pick<User, 'name' | 'email'> & Record<'className', string>
) { ... }
```

**Commonly Used Utility Types:**

- `Record<K, V>` - Object with specific key-value types
- `Pick<T, K>` - Extract specific properties from existing type
- `Omit<T, K>` - Exclude specific properties from existing type
- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required

---

### Import Path Convention

**Relative paths are forbidden. Always use `~` alias:**

```typescript
// ❌ BAD: Relative paths
import { User } from "../../../types/user";
import { Button } from "../../components/button";
import { useUsers } from "./use-users"; // Even in same directory

// ✅ GOOD: ~ alias (even within same directory)
import { User } from "~/types/user";
import { Button } from "~/components/button";
import { useUsers } from "~/features/users/hooks/use-users";
```

---

### Use Named Exports (default export forbidden)

Do not use default exports except for Next.js pages (`src/pages/**/*.tsx`) and Storybook.

```typescript
// ❌ BAD: Default Export (outside pages)
export default function UserTable({ users }: UserTableProps) { ... }

// ✅ GOOD: Named Export
export function UserTable({ users }: UserTableProps) { ... }
export type UserTableProps = { ... }
```

---

### Code Comments in Japanese

Write code comments in Japanese.

```typescript
// ❌ BAD: English comments
// Add user to the list
// Loop through all items

// ✅ GOOD: Japanese comments (explain WHY, not WHAT)
// APIの仕様上、ページネーションは1始まり
const page = currentPage + 1;

// TODO(@username 2024-12): 認証API完成後に削除
const mockToken = "dev-token";
```

**Comment Guidelines:**

- Write WHY, not WHAT
- Add explanations for complex business logic
- Include assignee and deadline for TODOs

---

## MEDIUM Priority Rules

### File Organization

MANY SMALL FILES > FEW LARGE FILES:

- High cohesion, low coupling
- 200-400 lines typical, 800 max
- Extract utilities from large components
- Organize by feature/domain, not by type

---

### Error Handling

ALWAYS handle errors comprehensively:

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  throw new Error("Detailed user-friendly message");
}
```

---

### Input Validation

ALWAYS validate user input:

```typescript
import * as v from "valibot";

const schema = v.object({
  email: v.pipe(v.string(), v.email("有効なメールアドレスを入力してください")),
  age: v.pipe(
    v.number(),
    v.integer("整数を入力してください"),
    v.minValue(0, "0以上を入力してください"),
    v.maxValue(150, "150以下を入力してください"),
  ),
});

const validated = v.parse(schema, input);
```

---

### Forbidden Patterns

Flag these patterns if found:

1. **Remaining console.log** (remove after debugging)
2. **Excessive any type usage** (use TypeScript Utility types)
3. **Hardcoded secrets** (use environment variables)
4. **Files exceeding 800 lines** (aim for 200-400 lines)
5. **Functions exceeding 50 lines** (except components)
6. **Nesting deeper than 4 levels**

---

### as const satisfies Pattern

Use `as const satisfies` for object constants to preserve literal types while type-checking:

```typescript
// ✅ GOOD: Preserve literal types while type-checking
const roleLabels = {
  admin: "管理者",
  manager: "マネージャー",
  member: "メンバー",
} as const satisfies Record<UserRole, string>;

// ❌ BAD: Type inference becomes string
const roleLabels: Record<UserRole, string> = {
  admin: "管理者",
  manager: "マネージャー",
  member: "メンバー",
};
```

---

## Code Review Checklist

Before marking work complete:

1. **CRITICAL**: better-result violations, Immutability violations, hardcoded secrets → **MUST FIX**
2. **HIGH**: Utility type not used, relative paths, default export, English comments, console.log → **STRONGLY RECOMMENDED**
3. **MEDIUM**: File size, function size, nesting depth, as const satisfies → **SUGGESTION LEVEL**

---

## Reference Documentation

- `CLAUDE.md` - Project-wide instructions
- `CODING_GUIDELINES.md` - Detailed coding conventions
- `.claude/rules/better-result.md` - better-result pattern details
