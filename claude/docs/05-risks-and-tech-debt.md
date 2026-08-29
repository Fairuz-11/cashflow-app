# 05 — Risks & Tech Debt

Severity: 🔴 High / 🟡 Medium / 🟢 Low

---

## 🔴 Security

### 1. `requireAuth()` returns 307 redirect from API routes
`lib/session.ts:requireAuth()` calls Next.js `redirect()`, which throws a `NEXT_REDIRECT` error. In API route handlers, this produces a 307 redirect response to `/login` rather than a `401 Unauthorized` JSON response. Client-side `fetch` calls that receive a redirect will silently follow it or fail opaquely — client code currently doesn't handle non-ok responses from `/api/transactions`. A proper fix is to check the session in API routes directly and return `NextResponse.json({error:"Unauthorized"},{status:401})`.

### 2. No rate limiting on auth endpoints
`POST /api/auth/register` and the NextAuth credentials endpoint have no rate limiting or brute-force protection. Repeated login attempts with different passwords face no throttle.

### 3. Credentials-only auth with no password reset
Users who lose their password have no recovery path. This is a UX risk that becomes a support problem at scale.

---

## 🟡 Data Integrity

### 4. `amount` Decimal → Number coercion at every call site
Prisma returns `Decimal` objects; the app converts them with `Number(t.amount)` inline at each query result. For typical IDR household amounts this is fine, but JS floating-point precision is 53 bits (~15 decimal digits), and the DB stores up to 15,2. No shared helper function means if the coercion strategy needs to change, it has to be updated in 5+ places.

### 5. Destructive seed script
`prisma/seed.ts` runs `deleteMany()` on both `Transaction` and `User` tables before inserting demo data. Running `npx prisma db seed` in a production environment would wipe all user data. The seed should check for existing data or be guarded.

### 6. No pagination
All transaction queries return the full set for the authenticated user. With no limit, a heavily-used account will cause large DB result sets and slow page loads. `/api/transactions` and the server actions both lack pagination support.

---

## 🟡 Architecture

### 7. Mixed rendering strategy (inconsistency)
The dashboard page is a server component that fetches data via server actions (SSR, no loading state). The income/expense pages are client components that fetch via REST API on mount (CSR, loading spinner). This inconsistency means the UX differs between pages and the data access patterns are split without a clear reason. Either all pages should use SSR + server actions, or all should use client-side fetching.

### 8. Dead server actions
`getTransactionsByType()` and `getTransaction()` are defined and exported in `lib/actions/transaction.ts` but called nowhere in the app. They were likely written in anticipation of use that never happened, or replaced by the REST API approach on income/expense pages.

### 9. Redundant `GET /api/user` call
Income and expense pages call `GET /api/user` on every mount to get the user's name for the sidebar. The name is already in the NextAuth session token, accessible client-side via `useSession()` — no server round-trip needed.

### 10. Duplicated `formatCurrency` and `formatDate`
`Intl.NumberFormat` and `Intl.DateTimeFormat` helpers are copy-pasted into at least 4 components (`RecentTransactions`, `IncomePage`, `ExpensePage`, `TransactionTable`). These should live in a shared `lib/utils.ts`.

---

## 🟢 UX / DX

### 11. `window.confirm()` for delete confirmation
Not accessible (can be blocked, can't be styled, uses system UI). Should be replaced with a confirmation modal.

### 12. No error state on data fetch failure
If `fetchTransactions()` fails, the client shows an empty state with no error message. Users see "no transactions" rather than "something went wrong".

### 13. `?registered=true` not handled in login page
The register page redirects to `/login?registered=true` after success, but the login page ignores this parameter. A success toast or banner would improve the flow.

### 14. Entire codebase is uncommitted
The substantive application code — all of `app/`, `components/`, `lib/`, `prisma/`, `types/` — exists only as untracked files. Only the Next.js scaffold is committed. This makes git-based change tracking, collaboration, and rollback impossible until a commit is made.

---

## Summary Table

| # | Issue | Severity | Effort to Fix |
|---|---|---|---|
| 1 | requireAuth() returns 307 from API routes | 🔴 | Low |
| 2 | No rate limiting on auth | 🔴 | Medium |
| 3 | No password reset | 🔴 | High |
| 4 | Decimal coercion repeated at every call site | 🟡 | Low |
| 5 | Destructive seed script | 🟡 | Low |
| 6 | No pagination | 🟡 | Medium |
| 7 | Mixed SSR/CSR strategy | 🟡 | Medium |
| 8 | Dead server actions | 🟢 | Low (delete them) |
| 9 | Redundant /api/user call | 🟢 | Low |
| 10 | Duplicated format helpers | 🟢 | Low |
| 11 | window.confirm() for delete | 🟢 | Medium |
| 12 | No error state on fetch failure | 🟢 | Low |
| 13 | ?registered=true ignored | 🟢 | Low |
| 14 | Entire app uncommitted | 🔴 | Low (just commit) |
