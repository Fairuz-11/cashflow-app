# Phase 4 — Verification Spot-Checks

10 specific claims verified against source files.

| # | Claim | Source | Result |
|---|---|---|---|
| 1 | `session.strategy: "jwt"` in `lib/auth.ts` | grep → `lib/auth.ts:50` `strategy: "jwt"` | ✅ Confirmed |
| 2 | `bcrypt.hash(password, 10)` — 10 rounds in both register route and seed | grep → `app/api/auth/register/route.ts:32`, `prisma/seed.ts:16` | ✅ Confirmed |
| 3 | `formatCurrency` duplicated in 5 files | grep → `summary-cards.tsx`, `recent-transactions.tsx`, `transaction-table.tsx`, `income/page.tsx`, `expense/page.tsx` | ✅ Confirmed — actually 5 files, docs said "4+" which is correct |
| 4 | `getTransaction(id)` is dead code (never called) | grep across all `.ts`/`.tsx` — zero results for `getTransaction` calls | ✅ Confirmed — function is defined and exported but never imported or invoked |
| 5 | `getTransactionsByType` is dead code (never called) | grep across all `.ts`/`.tsx` — zero results | ✅ Confirmed — same situation as above |
| 6 | `revalidatePath` called for `/dashboard`, `/income`, `/expense` on create, update, AND delete | Direct read of `lib/actions/transaction.ts` lines 106-108, 146-148, 182-184 | ✅ Confirmed — all three mutations call all three paths |
| 7 | `Number(t.amount)` coercion at every query result | Direct read of `lib/actions/transaction.ts` (map calls) and `app/api/transactions/route.ts` (formattedTransactions map) | ✅ Confirmed — pattern appears in: `getRecentTransactions`, `getTransactionsByType`, `getTransaction`, and the API route handler |
| 8 | `?registered=true` set by register page, never read in login page | grep → `app/register/page.tsx:58` sets it; no match in `app/login/page.tsx` | ✅ Confirmed — login page has no `useSearchParams`, no `?registered` handling |
| 9 | `confirm(...)` used for delete confirmation in TransactionTable | grep → `components/transactions/transaction-table.tsx:35` `if (!confirm(...))` | ✅ Confirmed |
| 10 | `/api/transactions` has no pagination — no `take`/`limit`/`offset` params | Direct read of `app/api/transactions/route.ts` — `findMany` with no `take` | ✅ Confirmed — `findMany({ where, orderBy })` with no pagination arguments |

## Summary
All 10 claims confirmed. No corrections needed to the documentation.

Note: ripgrep pattern limitations on this Windows/PowerShell environment required some checks to fall back to direct file reads. All claims were verified against actual source content, not inferred.
