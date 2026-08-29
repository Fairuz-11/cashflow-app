# 03 — Data Layer

## Database

PostgreSQL, accessed via Prisma 5.22. Connection URL comes from `DATABASE_URL` env var. No migrations have been run yet in the committed history — the `prisma/` directory itself is untracked.

## Schema Summary

### `users` table
```
id            cuid PK
name          text nullable
email         text unique NOT NULL
password      text NOT NULL (bcrypt)
emailVerified timestamptz nullable
image         text nullable
createdAt     timestamptz default now()
updatedAt     timestamptz auto-update
```

### `transactions` table
```
id               cuid PK
type             enum('income','expense') NOT NULL
description      text NOT NULL
amount           decimal(15,2) NOT NULL
transaction_date timestamptz NOT NULL
user_id          text FK → users.id (cascade delete)
created_at       timestamptz default now()
updated_at       timestamptz auto-update

Indexes: user_id, type, transaction_date
```

### NextAuth tables
- `accounts` — OAuth provider tokens (unused currently)
- `sessions` — DB sessions (unused; JWT strategy is active)
- `verification_tokens` — email verification (unused; no verification flow)

## Prisma Client

Singleton in `lib/prisma.ts`:

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: [...] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Development logging: queries + errors + warnings. Production: errors only.

## Decimal → Number Coercion

Prisma returns `amount` as a `Decimal` object (not a JS `number`). Every query result maps it manually:

```typescript
transactions.map(t => ({ ...t, amount: Number(t.amount) }))
```

This pattern is repeated inline in every call site (server actions + API route handler) rather than being a shared utility. Works correctly for IDR amounts within typical ranges.

## Server Actions

All mutations live in `lib/actions/transaction.ts` as `"use server"` functions:

| Function | Operation | Ownership Check | revalidatePath |
|---|---|---|---|
| `getSummary()` | Aggregate SUM by type | via userId filter | No |
| `getRecentTransactions(limit)` | findMany, desc date | via userId filter | No |
| `getTransactionsByType(type)` | findMany by type | via userId filter | No — **DEAD CODE** |
| `createTransaction(data)` | insert | N/A (insert uses userId) | /dashboard, /income, /expense |
| `updateTransaction(id, data)` | update | findFirst(id + userId) | /dashboard, /income, /expense |
| `deleteTransaction(id)` | delete | findFirst(id + userId) | /dashboard, /income, /expense |
| `getTransaction(id)` | findFirst | via userId filter | No — **DEAD CODE** |

All mutations validate input with `transactionSchema` (Zod):

```typescript
z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1),
  amount: z.number().positive(),
  transactionDate: z.date(),
})
```

## Seed Data

`prisma/seed.ts` creates one demo user (`demo@example.com` / `password123`) and 17 sample transactions spanning Jan–Feb 2024. The seed script clears all users and transactions before inserting — destructive, not idempotent.

## Known Issues

1. **No pagination** — `getTransactionsByType` and `/api/transactions` return all records for the user. Large datasets will cause slow queries and large payloads.

2. **Decimal coercion repeated at every call site** — no shared `serializeTransaction()` helper.

3. **Seed script is destructive** — running it in production would wipe all user data.

4. **No DB migration files in version control** — `prisma/` is untracked. The current DB state is established via `prisma db push` (schema sync) rather than tracked migrations.
