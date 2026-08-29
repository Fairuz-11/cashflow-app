# 04 — Frontend Architecture

## Page Rendering Strategy

The app uses a split strategy — a deliberate choice, though with some inconsistency:

| Page | Rendering | Data Fetching |
|---|---|---|
| `/` | Server Component | None (redirect only) |
| `/dashboard` | Server Component | Server actions at request time |
| `/income` | Client Component | `useEffect` + `fetch /api/transactions?type=income` |
| `/expense` | Client Component | `useEffect` + `fetch /api/transactions?type=expense` |
| `/login` | Client Component | None (form only) |
| `/register` | Client Component | None (form only) |

Dashboard is SSR — rendered on the server with fresh data, no loading state. Income/expense are CSR — show a spinner on mount while fetching.

## Component Hierarchy

```
app/layout.tsx (RootLayout)
  └── SessionProvider (next-auth/react wrapper)
      ├── /login → LoginPage
      ├── /register → RegisterPage
      └── DashboardLayout (sidebar + main area)
            ├── Sidebar (nav links + logout)
            └── [page content]
                  ├── /dashboard → SummaryCards + RecentTransactions
                  ├── /income  → TransactionTable + TransactionFormModal
                  └── /expense → TransactionTable + TransactionFormModal
```

## UI Components (`components/ui/`)

All hand-rolled. No third-party component library.

**Button**
- Props: `variant` (primary/secondary/danger/ghost), `size` (sm/md/lg), `fullWidth`
- Extends `ButtonHTMLAttributes<HTMLButtonElement>`

**Card / CardHeader / CardTitle / CardContent**
- Simple composition pattern — no context, just nested divs

**Input**
- `forwardRef` with `label` and `error` props
- Adds red asterisk for `required` fields

**Modal**
- Fixed overlay with backdrop click-to-close
- Body scroll lock via `useEffect` on `isOpen`
- Sizes: sm/md/lg/xl

**Sidebar**
- Active link detection via `usePathname()`
- Hardcoded nav items: Rekap (dashboard), Uang Masuk (income), Uang Keluar (expense)
- Logout button calls `onLogout` prop

**Loading / LoadingButton**
- `Loading` — full-height centered spinner
- `LoadingButton` — small inline spinner for button states

## Transaction CRUD Flow

**Read (income/expense pages):**
```
page mounts → fetchTransactions() → GET /api/transactions?type=X → setState
```

**Create/Edit:**
```
"Tambah" button → TransactionFormModal opens
  → form submit → createTransaction() or updateTransaction() server action
    → success → onSuccess() → fetchTransactions() + router.refresh()
```

**Delete:**
```
"Hapus" button → window.confirm() → deleteTransaction() server action
  → success → router.refresh()
```

Note: after delete, `router.refresh()` is called but `fetchTransactions()` is not — so the transaction table updates via route re-render, not a state update. This works but is a different pattern than create/edit.

## Currency & Date Formatting

`Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })` — used everywhere amounts are shown.

`Intl.DateTimeFormat("id-ID", ...)` — used for date display.

Both helpers are **duplicated** across: `RecentTransactions`, `IncomePage`, `ExpensePage`, `TransactionTable`. No shared utility file.

## Styling Conventions

- Tailwind v4 CSS-first (no `tailwind.config.ts`)
- Color tokens: `blue-600` (primary/brand), `green-600` (income), `red-600` (expense), `gray-*` (neutral)
- No dark mode support in components (CSS vars are defined but components use hardcoded Tailwind classes)
- Inline SVG icons — no icon library

## Known Issues

1. **Income/expense pages call `GET /api/user` on every mount** — only to get the user's name for the sidebar. The NextAuth session already has `session.user.name` available via `useSession()`, making this round-trip redundant.

2. **No shared formatting utilities** — `formatCurrency` and `formatDate` are copy-pasted into 4+ components.

3. **`window.confirm()` for delete** — not accessible and can be blocked by browser settings.

4. **No error state UI** — if `fetchTransactions` fails, `isLoading` becomes false and an empty state is shown with no error message.

5. **Delete uses `router.refresh()` while create/edit uses `fetchTransactions()`** — inconsistent update mechanism.

6. **`?registered=true` param ignored** — no success banner after registration.
