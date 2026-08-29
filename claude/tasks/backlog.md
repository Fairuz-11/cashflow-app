# Task Backlog

Actionable items surfaced during analysis. Ordered by severity.

---

## High Priority (Security / Correctness)

- [ ] **Fix API auth responses** — Replace `requireAuth()` in API route handlers with direct session checks that return `401 JSON` instead of a 307 redirect. Affects `app/api/transactions/route.ts` and `app/api/user/route.ts`.

- [ ] **Commit all application code** — The entire app (`app/`, `components/`, `lib/`, `prisma/`, `types/`) is untracked. Run a `git add` + `git commit` to establish a proper baseline in version control.

- [ ] **Add rate limiting to auth endpoints** — At minimum, limit `POST /api/auth/register` and the NextAuth credentials endpoint. Can use `next-rate-limit` or a Redis-based solution.

## Medium Priority (Architecture / UX)

- [ ] **Guard seed script from production use** — Add a check in `prisma/seed.ts` to abort if `NODE_ENV === 'production'` or if records already exist.

- [ ] **Add pagination to transaction queries** — Both `/api/transactions` and the server action queries return unbounded results. Add `limit`/`offset` or cursor-based pagination.

- [ ] **Show success banner after registration** — The login page receives `?registered=true` but ignores it. Add a conditional banner.

- [ ] **Unify SSR/CSR data fetching strategy** — Either convert income/expense pages to server components (SSR + server actions) or convert dashboard to CSR. The mixed approach is the main architectural inconsistency.

## Low Priority (Code Quality / DX)

- [ ] **Extract shared formatting utilities** — Move `formatCurrency` and `formatDate` to `lib/utils.ts`. Remove duplicates from all 4 components.

- [ ] **Remove dead server actions** — Delete `getTransactionsByType()` and `getTransaction()` from `lib/actions/transaction.ts`, or use them to replace the REST API approach on income/expense pages.

- [ ] **Replace `GET /api/user` with `useSession()`** — Income/expense pages call the API just to get the user's name. Use `useSession()` from `next-auth/react` instead.

- [ ] **Replace `window.confirm()` for delete** — Implement an accessible confirmation modal component.

- [ ] **Add error state UI** — When `fetchTransactions()` fails, show an error message instead of an empty state.

- [ ] **Extract Decimal coercion helper** — Create a `serializeTransaction()` helper function in `lib/utils.ts` to centralize `Number(t.amount)` conversion.

## Future Considerations

- Password reset / forgot password flow
- OAuth provider (Google, etc.) — adapter is already in place
- Export transactions as CSV
- Date range filtering
- Charts / visualizations for spending trends
