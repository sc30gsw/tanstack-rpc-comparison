# better-result Pattern (CRITICAL)

## API Layer (mutations.ts)

Use the `Result.tryPromise` pattern. **Key order must be alphabetical** (`catch` → `try`).

```typescript
// ✅ Good: Result.tryPromise pattern
export function createSession(params: LoginParams) {
  return Result.tryPromise({
    catch: toApiError, // Alphabetical order: catch → try
    try: async () => {
      const response = await apiClient.auth.v1.users.sign_in.post({...})
      return response.body
    },
  })
}

// ❌ Bad: Manual try/catch
export async function createSession(params: LoginParams) {
  try {
    const response = await apiClient.auth.v1.users.sign_in.post({...})
    return Result.ok(response.body)
  } catch (error) {
    return Result.err(toApiError(error))
  }
}
```

## Hook Layer (use-\*.ts)

Use the `result.match()` pattern. **Key order must be alphabetical** (`err` → `ok`).

```typescript
// ✅ Good: match pattern
result.match({
  err: (error) => {
    showError({ message: error.message, title: 'Error' })
  },
  ok: (data) => {
    showSuccess({ message: 'Success', title: 'Complete' })
    onSuccess(data)
  },
})

// ❌ Bad: if/return pattern (prone to bugs)
if (result.isErr()) {
  showError({...})
}
// Forgetting return causes success handling to execute even on error
showSuccess({...})
onSuccess()
```

## Forbidden Patterns

1. **Wrapping Result with try/catch** - Result doesn't throw, so it won't be caught
2. **Forgetting return after `if (result.isErr())`** - Success handling executes even on error
3. **Redundant async keyword usage** - Functions returning `Result.tryPromise` don't need async

## Reference

[better-result](https://github.com/dmmulroy/better-result)
