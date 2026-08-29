# Phase 2 — Contract Map (Raw Notes)

## Caller → Handler Map

| Caller | Calls | Handler | Data Shape |
|---|---|---|---|
| `app/login/page.tsx` | `signIn("credentials", {...})` | `app/api/auth/[...nextauth]/route.ts` → `lib/auth.ts authorize()` | `{email, password}` → JWT session |
| `app/register/page.tsx` | `fetch POST /api/auth/register` | `app/api/auth/register/route.ts` | `{name, email, password}` → `{message, user: {id,name,email,createdAt}}` |
| `app/income/page.tsx` | `fetch GET /api/transactions?type=income` | `app/api/transactions/route.ts` | `Transaction[]` with `amount: number` |
| `app/expense/page.tsx` | `fetch GET /api/transactions?type=expense` | `app/api/transactions/route.ts` | `Transaction[]` with `amount: number` |
| `app/income/page.tsx` | `fetch GET /api/user` | `app/api/user/route.ts` | `{id, name, email}` |
| `app/expense/page.tsx` | `fetch GET /api/user` | `app/api/user/route.ts` | `{id, name, email}` |
| `components/transactions/transaction-form-modal.tsx` | `createTransaction(data)` | `lib/actions/transaction.ts` | `{type, description, amount, transactionDate}` → `{success, transaction?}` |
| `components/transactions/transaction-form-modal.tsx` | `updateTransaction(id, data)` | `lib/actions/transaction.ts` | same input → `{success, transaction?}` |
| `components/transactions/transaction-table.tsx` | `deleteTransaction(id)` | `lib/actions/transaction.ts` | `id: string` → `{success, error?}` |
| `app/dashboard/page.tsx` | `getSummary()` | `lib/actions/transaction.ts` | `{}` → `{totalIncome, totalExpense, profit}` |
| `app/dashboard/page.tsx` | `getRecentTransactions(10)` | `lib/actions/transaction.ts` | `{limit}` → `Transaction[]` with `amount: number` |

## Dead Code (defined but never called)
- `getTransactionsByType(type)` in `lib/actions/transaction.ts`
- `getTransaction(id)` in `lib/actions/transaction.ts`

## Mixed Data Access Patterns
The income/expense pages use **REST API** (fetch) for reads, while the dashboard uses **server actions** for reads, and the transaction form/table use **server actions** for writes. This inconsistency means:
- Income/expense data is loaded on the client side after hydration (causes loading flash)
- Dashboard data is server-side rendered (no loading flash)
- Writes revalidate paths but the client components re-fetch via REST API in `handleSuccess()`

## Zod Schema Mismatch
`transactionSchema` in `lib/actions/transaction.ts` expects `transactionDate: z.date()`.
The modal passes `new Date(transactionDate)` where `transactionDate` is a string from a date input. This works correctly — the Date object passes the `z.date()` check.

## Missing API Contract: Transaction Mutations via REST
There is no `POST /api/transactions` endpoint for create, no `PUT /api/transactions/[id]` for update, and no `DELETE /api/transactions/[id]` for delete. All mutations go through server actions exclusively. The `GET /api/transactions` route is only used by the client-side income/expense pages.
