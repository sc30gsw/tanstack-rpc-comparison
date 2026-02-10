# upfetch Pattern (CRITICAL)

> **Native fetch() usage is absolutely FORBIDDEN.**
> Use upfetch for ALL HTTP requests.

## Why upfetch?

### Problems with Native fetch()

- ❌ No type inference, manual response parsing required
- ❌ Cumbersome error handling (`response.ok` checks, excessive try/catch)
- ❌ Manual implementation of retry/timeout logic for every request
- ❌ No schema validation, risk of runtime errors

### Benefits of upfetch

- ✅ **Type Safety**: Automatic type inference from Valibot schemas
- ✅ **better-result Integration**: Seamless integration with Result.tryPromise pattern
- ✅ **Built-in Features**: Retry, timeout, progress tracking out of the box
- ✅ **Code Reduction**: 40% less boilerplate (15 lines → 9 lines)
- ✅ **Consistency**: Unified pattern across the entire project

---

## CRITICAL Priority Rules

### Rule 1: Native fetch() is Absolutely Forbidden

**Severity: CRITICAL** - Violations require immediate correction.

```typescript
// ❌ FORBIDDEN: Native fetch() usage
async function getUsers() {
  const response = await fetch("/api/users");
  const data = await response.json();
  return data;
}

// ❌ FORBIDDEN: Even with error handling
async function getUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ✅ REQUIRED: Use upfetch
import { upfetch } from "~/lib/upfetch";
import * as v from "valibot";

function getUsers() {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/users", {
        schema: v.array(UserSchema),
      });
    },
  });
}
```

---

## API Layer Pattern (mutations.ts / queries.ts)

### Pattern 1: GET Requests (Data Fetching)

**Key order must be alphabetical**: `catch` → `try`

```typescript
import { Result } from "better-result";
import * as v from "valibot";
import { toApiError } from "~/lib/errors";
import { upfetch } from "~/lib/upfetch";

// Schema definition
const UserSchema = v.object({
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  email: v.pipe(v.string(), v.email()),
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  role: v.picklist(["admin", "manager", "member"]),
  status: v.picklist(["active", "inactive", "pending"]),
});

export type User = v.InferOutput<typeof UserSchema>;

// ✅ GOOD: Result.tryPromise + upfetch pattern
export function getUsers() {
  return Result.tryPromise({
    catch: toApiError, // Alphabetical order: catch → try
    try: async () => {
      return await upfetch("/api/users", {
        schema: v.array(UserSchema),
      });
    },
  });
}

export function getUserById(id: string) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch(`/api/users/${id}`, {
        schema: UserSchema,
      });
    },
  });
}
```

### Pattern 2: POST/PUT Requests (Data Submission)

```typescript
const CreateUserInputSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  name: v.string(),
  password: v.pipe(v.string(), v.minLength(8)),
  role: v.picklist(["admin", "manager", "member"]),
});

export type CreateUserInput = v.InferInput<typeof CreateUserInputSchema>;

// ✅ GOOD: POST request with body
export function createUser(params: CreateUserInput) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/users", {
        body: params,
        method: "POST",
        schema: UserSchema,
      });
    },
  });
}

// ✅ GOOD: PUT request
export function updateUser(id: string, params: Partial<CreateUserInput>) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch(`/api/users/${id}`, {
        body: params,
        method: "PUT",
        schema: UserSchema,
      });
    },
  });
}
```

### Pattern 3: DELETE Requests

```typescript
// ✅ GOOD: DELETE request (no response)
export function deleteUser(id: string) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      await upfetch(`/api/users/${id}`, {
        method: "DELETE",
      });
    },
  });
}
```

### Pattern 4: Query Parameters

```typescript
type GetUsersParams = {
  page: number;
  perPage: number;
  role?: string;
  search?: string;
};

// ✅ GOOD: With query parameters
export function getUsers(params: GetUsersParams) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/users", {
        params: {
          page: params.page.toString(),
          per_page: params.perPage.toString(),
          ...(params.role && { role: params.role }),
          ...(params.search && { search: params.search }),
        },
        schema: v.object({
          pagination: v.object({
            page: v.number(),
            perPage: v.number(),
            total: v.number(),
          }),
          users: v.array(UserSchema),
        }),
      });
    },
  });
}
```

### Pattern 5: Custom Headers

```typescript
// ✅ GOOD: Custom headers (authentication tokens, etc.)
export function getProtectedData(token: string) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        schema: ProtectedDataSchema,
      });
    },
  });
}
```

### Pattern 6: File Upload

```typescript
// ✅ GOOD: File upload with FormData
export function uploadAvatar(file: File) {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      const formData = new FormData();
      formData.append("avatar", file);

      return await upfetch("/api/users/avatar", {
        body: formData,
        method: "POST",
        schema: v.object({
          url: v.pipe(v.string(), v.url()),
        }),
      });
    },
  });
}
```

### Pattern 7: Custom Retry Configuration

```typescript
// ✅ GOOD: Override retry settings for specific endpoints
export function getCriticalData() {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/critical", {
        retry: {
          attempts: 5, // Override default 3 to 5 attempts
          delay: (ctx) => ctx.attempt * 2000, // 2s, 4s, 6s, 8s, 10s
        },
        schema: CriticalDataSchema,
      });
    },
  });
}
```

---

## Hook Layer Pattern (use-\*.ts)

### Pattern 1: TanStack Query Integration

**Key order must be alphabetical**: `err` → `ok`

```typescript
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "~/features/users/api/queries";

// ✅ GOOD: useQuery with result.match()
export function useUsers() {
  return useQuery({
    queryFn: async () => {
      const result = await getUsers();

      return result.match({
        err: (error) => {
          throw error; // TanStack Query handles this
        },
        ok: (data) => data,
      });
    },
    queryKey: ["users"],
  });
}

// ✅ GOOD: With parameters
export function useUserById(id: string) {
  return useQuery({
    enabled: !!id,
    queryFn: async () => {
      const result = await getUserById(id);

      return result.match({
        err: (error) => {
          throw error;
        },
        ok: (data) => data,
      });
    },
    queryKey: ["users", id],
  });
}
```

### Pattern 2: useMutation Integration

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "~/features/users/api/mutations";
import type { CreateUserInput } from "~/features/users/api/mutations";

// ✅ GOOD: useMutation with result.match()
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateUserInput) => {
      const result = await createUser(params);

      return result.match({
        err: (error) => {
          throw error; // useMutation handles this in onError
        },
        ok: (data) => data,
      });
    },
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

### Pattern 3: Custom Error Handling

```typescript
import { showError, showSuccess } from "~/lib/toast";

// ✅ GOOD: Custom error handling
export function useCreateUserWithToast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateUserInput) => {
      const result = await createUser(params);

      return result.match({
        err: (error) => {
          showError({
            message: error.message,
            title: "User Creation Error",
          });
          throw error;
        },
        ok: (data) => {
          showSuccess({
            message: "User created successfully",
            title: "Success",
          });
          return data;
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

---

## Schema Definition Pattern

### Pattern 1: Basic Schema Definition

```typescript
import * as v from "valibot";

// ✅ GOOD: Valibot schema definition
export const UserSchema = v.object({
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  email: v.pipe(v.string(), v.email()),
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  role: v.picklist(["admin", "manager", "member"]),
  status: v.picklist(["active", "inactive", "pending"]),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

// ✅ GOOD: Type inference
export type User = v.InferOutput<typeof UserSchema>;
```

### Pattern 2: Nested Schema

```typescript
// ✅ GOOD: Nested objects
const AddressSchema = v.object({
  city: v.string(),
  country: v.string(),
  postalCode: v.string(),
  street: v.string(),
});

const UserWithAddressSchema = v.object({
  ...UserSchema.entries,
  address: AddressSchema,
});

export type UserWithAddress = v.InferOutput<typeof UserWithAddressSchema>;
```

### Pattern 3: Optional Fields

```typescript
// ✅ GOOD: Optional fields
const UpdateUserInputSchema = v.object({
  email: v.optional(v.pipe(v.string(), v.email())),
  name: v.optional(v.string()),
  role: v.optional(v.picklist(["admin", "manager", "member"])),
});

export type UpdateUserInput = v.InferInput<typeof UpdateUserInputSchema>;
```

---

## Forbidden Patterns

### 1. Native fetch() Usage

```typescript
// ❌ FORBIDDEN
const response = await fetch("/api/users");
const data = await response.json();
```

### 2. Wrapping Result with try/catch

```typescript
// ❌ FORBIDDEN: Result doesn't throw, so it won't be caught
try {
  const result = await getUsers();
  // result is always Ok or Err
} catch (error) {
  // This block will NEVER execute
}
```

### 3. if/return Pattern (Prone to Missing return)

```typescript
// ❌ FORBIDDEN: Forgetting return causes bugs
const result = await createUser(params);

if (result.isErr()) {
  showError({ message: result.error.message });
  // Forgetting return → success handling executes even on error
}

showSuccess({ message: "Success" });
onSuccess();
```

### 4. Redundant async Keyword

```typescript
// ❌ FORBIDDEN: Functions returning Result.tryPromise don't need async
export async function getUsers() {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/users", { schema });
    },
  });
}

// ✅ GOOD: Remove async
export function getUsers() {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/users", { schema });
    },
  });
}
```

### 5. upfetch Without Schema

```typescript
// ❌ BAD: Without schema, type safety is lost
const data = await upfetch("/api/users");
// data type is unknown

// ✅ GOOD: Always specify schema
const data = await upfetch("/api/users", {
  schema: v.array(UserSchema),
});
// data type is inferred as User[]
```

---

## Error Handling Integration

### Using toApiError

```typescript
import { toApiError } from "~/lib/errors";

// ✅ GOOD: Convert upfetch errors to ApiError with toApiError
export function getUsers() {
  return Result.tryPromise({
    catch: toApiError, // Convert upfetch errors to ApiError
    try: async () => {
      return await upfetch("/api/users", {
        schema: v.array(UserSchema),
      });
    },
  });
}
```

### Error Types

`toApiError` converts the following errors:

1. **ValidationError** (Schema validation failure)
   - `code: 'VALIDATION_ERROR'`
   - `status: 400`
   - `message: 'Invalid input data'`

2. **TimeoutError** (Timeout)
   - `code: 'TIMEOUT'`
   - `status: 408`
   - `message: 'Request timed out'`

3. **HTTP Error** (4xx, 5xx)
   - `code: 'HTTP_404'` (Based on status code)
   - `status: 404`
   - `message: Error message from response`

4. **Unknown Error**
   - `code: 'UNKNOWN_ERROR'`
   - `message: Error message or default`

---

## Code Review Checklist

Items to check during code review:

### CRITICAL Violations (Must Fix)

- [ ] No native `fetch()` usage
- [ ] `Result.tryPromise` key order is `catch` → `try`
- [ ] `result.match()` key order is `err` → `ok`

### HIGH Violations (Strongly Recommended)

- [ ] All upfetch calls specify `schema`
- [ ] Using `match` instead of `if (result.isErr())` pattern
- [ ] Using `toApiError` for error handling

### MEDIUM Violations (Recommended)

- [ ] No redundant `async` keywords
- [ ] Schema definitions properly infer types
- [ ] Custom retry settings are appropriate

---

## Migration Guide

### Step 1: Replace fetch() with upfetch

**Before (15 lines):**

```typescript
async function getUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}
```

**After (9 lines - 40% reduction):**

```typescript
function getUsers() {
  return Result.tryPromise({
    catch: toApiError,
    try: async () => {
      return await upfetch("/api/users", {
        schema: v.array(UserSchema),
      });
    },
  });
}
```

### Step 2: Add Schema Definitions

```typescript
// schemas/user.ts
import * as v from "valibot";

export const UserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
});

export type User = v.InferOutput<typeof UserSchema>;
```

### Step 3: Update Hook Layer

**Before:**

```typescript
const { data } = useQuery({
  queryFn: () => getUsers(),
  queryKey: ["users"],
});
```

**After:**

```typescript
const { data } = useQuery({
  queryFn: async () => {
    const result = await getUsers();
    return result.match({
      err: (error) => {
        throw error;
      },
      ok: (data) => data,
    });
  },
  queryKey: ["users"],
});
```

---

## Reference Documentation

- [up-fetch](https://github.com/L-Blondy/up-fetch) - Official documentation
- [better-result](https://github.com/dmmulroy/better-result) - Result type patterns
- [Valibot](https://valibot.dev/) - Schema validation library
- `~/lib/upfetch.ts` - Project-wide configuration
- `~/lib/errors.ts` - Error conversion functions
- `.claude/rules/better-result.md` - better-result pattern details
