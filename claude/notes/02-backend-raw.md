# Phase 1 — Backend / API / Data Layer (Raw Notes)

## Database Schema (Prisma + PostgreSQL)

### Models
**User**
- `id`: cuid, PK
- `name`: String? (nullable)
- `email`: String, unique
- `password`: String (bcrypt hash, 10 rounds)
- `emailVerified`, `image`: nullable, for OAuth compatibility
- Relations: → Transaction[], → Account[], → Session[]
- Table: `users`

**Transaction**
- `id`: cuid, PK
- `type`: enum `TransactionType` (income | expense)
- `description`: String
- `amount`: Decimal(15,2) — stored as DB decimal, converted to JS `Number` in every query result
- `transactionDate`: DateTime (mapped col: `transaction_date`)
- `userId`: String FK → User (cascade delete)
- Indexes: `userId`, `type`, `transactionDate`
- Table: `transactions`

**Account / Session / VerificationToken** — Standard NextAuth tables, managed by PrismaAdapter.

### Decimal coercion issue
`amount` is `Decimal` in Prisma but the app maps it to `number` with `Number(t.amount)` at every call site. This works for IDR amounts that fit in JS float precision but could lose precision for very large values. No shared helper function — the coercion is repeated inline.

## API Routes

### `GET /api/transactions`
- Auth: `requireAuth()` (redirects server-side — see risk note below)
- Query param: `?type=income|expense` (optional — returns all if omitted)
- Returns: array of transactions with `amount` as number
- No pagination, no sorting controls (always `transactionDate desc`)

### `POST /api/auth/register`
- No auth required (public)
- Validates with inline Zod schema: name (min 2), email (valid), password (min 6)
- Hashes password with bcrypt(10)
- Returns 201 on success, 400 for duplicate email or validation error, 500 for unexpected errors
- Password is never returned in response (uses `select`)

### `GET /api/auth/[...nextauth]` + `POST /api/auth/[...nextauth]`
- Standard NextAuth catch-all handler delegating to `authOptions`

### `GET /api/user`
- Auth: `requireAuth()`
- Returns: `{ id, name, email }` from session token (NOT a DB query — reads from JWT)
- Actually this returns the session user object, not a fresh DB lookup — name changes wouldn't be reflected without re-login

## Auth Layer (`lib/auth.ts`)

- Strategy: **JWT** (not database sessions)
- Provider: **CredentialsProvider** only (no OAuth)
- PrismaAdapter is configured but JWT strategy means the adapter's session table is not actively used for session management — it's there for the Account/VerificationToken tables
- `jwt` callback: copies `user.id` → `token.id` on sign-in
- `session` callback: copies `token.id` → `session.user.id`
- Session user has `{ id, name, email, image }` via type augmentation in `types/next-auth.d.ts`
- Custom pages: signIn → `/login`, signOut → `/login`, error → `/login`

## Server Actions (`lib/actions/transaction.ts`)

All marked `"use server"`. All require `requireAuth()`.

| Action | Description |
|---|---|
| `getSummary()` | Aggregate SUM of income and expense for current user; returns `{totalIncome, totalExpense, profit}` |
| `getRecentTransactions(limit)` | findMany ordered by transactionDate desc, take N |
| `getTransactionsByType(type)` | findMany filtered by type (defined but **not called anywhere** in the app — dead code) |
| `createTransaction(data)` | Validate with Zod, insert, revalidatePath x3 |
| `updateTransaction(id, data)` | Ownership check, validate, update, revalidatePath x3 |
| `deleteTransaction(id)` | Ownership check, delete, revalidatePath x3 |
| `getTransaction(id)` | Single fetch with ownership check (defined but **not called anywhere** — dead code) |

## `requireAuth()` in API Routes — Risk
`requireAuth()` in `lib/session.ts` calls `redirect()` on unauthenticated access. Inside API route handlers, `redirect()` throws a `NEXT_REDIRECT` error that propagates as a 307 redirect response — this works but is a non-standard pattern. The API routes catch generic errors and return 500, but `redirect()` throws a special error that would NOT be caught by a regular `try/catch` — it gets handled by the Next.js runtime. This means unauthenticated requests to `/api/transactions` will receive a 307 redirect to `/login` rather than a 401 JSON response, which is unexpected for an API endpoint and could confuse client-side fetch error handling.

## Prisma Client
- Singleton pattern in `lib/prisma.ts` — uses `globalThis` to avoid re-instantiation in dev hot-reload.
- Query logging enabled in development mode.
