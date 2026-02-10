---
name: coding-standards
description: Coding standards for e_value_management_frontend project. Best practices complementing CODING_GUIDELINES.md.
---

# Coding Standards & Best Practices

Coding standards for the e_value_management_frontend project.

> **Note**: For project structure, naming conventions, testing rules, and component structure, refer to `CODING_GUIDELINES.md`. This document provides complementary best practices.

## Code Quality Principles

### 1. Readability First

- Code is read more than written
- Clear variable and function names
- Self-documenting code preferred over comments
- Consistent formatting

### 2. KISS (Keep It Simple, Stupid)

- Simplest solution that works
- Avoid over-engineering
- No premature optimization
- Easy to understand > clever code

### 3. DRY (Don't Repeat Yourself)

- Extract common logic into functions
- Create reusable components
- Share utilities across modules
- Avoid copy-paste programming

### 4. YAGNI (You Aren't Gonna Need It)

- Don't build features before they're needed
- Avoid speculative generality
- Add complexity only when required
- Start simple, refactor when needed

### 5. AHA Programming (Avoid Hasty Abstractions)

> "prefer duplication over the wrong abstraction" — Sandi Metz

See the "AHA Programming" section in `CODING_GUIDELINES.md` for details.

## Immutability Pattern (CRITICAL)

**Immutability is mandatory in this project.**

```typescript
// ✅ ALWAYS: Use spread operator
const updatedUser = {
  ...user,
  name: "New Name",
};

const updatedArray = [...items, newItem];

const filteredArray = items.filter((item) => item.active);

// ❌ NEVER: Do not mutate directly
user.name = "New Name"; // BAD
items.push(newItem); // BAD
```

## Async/Await Best Practices

```typescript
// ✅ GOOD: Parallel execution when possible
const [users, departments, roles] = await Promise.all([
  fetchUsers(),
  fetchDepartments(),
  fetchRoles(),
]);

// ❌ BAD: Unnecessary sequential execution
const users = await fetchUsers();
const departments = await fetchDepartments();
const roles = await fetchRoles();
```

## better-result Pattern (CRITICAL)

This project uses `better-result` for type-safe error handling.

### API Layer (mutations.ts)

```typescript
import { Result } from 'better-result'

// ✅ GOOD: Result.tryPromise pattern (keys in alphabetical order)
export function createSession(params: LoginParams) {
  return Result.tryPromise({
    catch: toApiError, // alphabetical: catch → try
    try: async () => {
      const response = await apiClient.auth.v1.users.sign_in.post({...})
      return response.body
    },
  })
}

// ❌ BAD: Manual try/catch
export async function createSession(params: LoginParams) {
  try {
    return Result.ok(response.body)
  } catch (error) {
    return Result.err(toApiError(error))
  }
}
```

### Hook Layer (use-\*.ts)

```typescript
// ✅ GOOD: match pattern (keys in alphabetical order)
result.match({
  err: (error) => {
    showError({ message: error.message, title: 'エラー' })
  },
  ok: (data) => {
    showSuccess({ message: '成功しました' })
    onSuccess(data)
  },
})

// ❌ BAD: if/return pattern (prone to bugs)
if (result.isErr()) {
  showError({...})
}
// Missing return causes success code to run on error!
showSuccess({...})
```

## Conditional Rendering

```typescript
// ✅ GOOD: Clear conditional rendering
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ BAD: Nested ternary operators
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

## State Updates

```typescript
// ✅ GOOD: Functional update (when depending on previous state)
setCount((prev) => prev + 1);
setItems((prev) => [...prev, newItem]);

// ❌ BAD: Direct reference (can be stale in async scenarios)
setCount(count + 1);
```

## Code Smell Detection

Watch for these anti-patterns:

### 1. Long Functions

```typescript
// ❌ BAD: Function > 50 lines
function processUserData() {
  // 100 lines of code
}

// ✅ GOOD: Split into smaller functions
function processUserData() {
  const validated = validateData();
  const transformed = transformData(validated);
  return saveData(transformed);
}
```

### 2. Deep Nesting

```typescript
// ❌ BAD: 5+ levels of nesting
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // Do something
        }
      }
    }
  }
}

// ✅ GOOD: Early returns
if (!user) return;
if (!user.isAdmin) return;
if (!market) return;
if (!market.isActive) return;
if (!hasPermission) return;

// Do something
```

### 3. Magic Numbers

```typescript
// ❌ BAD: Unexplained numbers
if (retryCount > 3) {
}
setTimeout(callback, 500);

// ✅ GOOD: Named constants
const MAX_RETRIES = 3;
const DEBOUNCE_DELAY_MS = 500;

if (retryCount > MAX_RETRIES) {
}
setTimeout(callback, DEBOUNCE_DELAY_MS);
```

## JSDoc for Public APIs

Provide appropriate documentation for public APIs.

````typescript
/**
 * Searches users by query.
 *
 * @param query - Search query string
 * @param options - Pagination options
 * @returns Users list and total count
 * @throws {Error} If API call fails
 *
 * @example
 * ```typescript
 * const { users, total } = await searchUsers('john', { page: 1, perPage: 10 })
 * ```
 */
export async function searchUsers(
  query: string,
  options: PaginationOptions,
): Promise<UsersResponse> {
  // Implementation
}
````

## Performance Best Practices

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### Data Fetching Optimization

```typescript
// ✅ GOOD: Fetch only needed columns
const { data } = await apiClient.users.$get({
  query: { select: ["id", "name", "email"] },
});

// ❌ BAD: Fetch everything
const { data } = await apiClient.users.$get();
```

> **Note**: Manual memoization (`useMemo`/`useCallback`) is prohibited in this project. Rely on React 19's automatic optimization.

## Comments & Documentation

### When to Comment

```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the API during outages
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);

// Deliberately allowing mutation here for performance with large arrays
items.push(newItem);

// ❌ BAD: Stating the obvious
// Increment counter by 1
count++;

// Set name to user's name
name = user.name;
```

---

**Remember**: Code quality is not negotiable. Clear, maintainable code enables rapid development and confident refactoring.
