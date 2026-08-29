# Phase 1 — Frontend Deep-Dive (Raw Notes)

## Pages

### `/` — `app/page.tsx`
- Server component. Just checks `getCurrentUser()` and redirects — `/dashboard` if logged in, `/login` if not.
- No rendering of its own.

### `/login` — `app/login/page.tsx`
- `"use client"`. Uses `signIn("credentials", { redirect: false })` from `next-auth/react`.
- On success, `router.push("/dashboard")` + `router.refresh()`.
- On failure, generic Indonesian error message: "Email atau password salah".
- Note: does NOT handle the `?registered=true` query param that the register page appends — no success banner shown after registration.

### `/register` — `app/register/page.tsx`
- `"use client"`. Calls `POST /api/auth/register` directly (not a server action).
- Client-side validation: passwords must match, min 6 chars.
- On success: `router.push("/login?registered=true")` — but login page ignores this param.

### `/dashboard` — `app/dashboard/page.tsx`
- Server component. Calls `requireAuth()`, `getSummary()`, `getRecentTransactions(10)`.
- Renders `SummaryCards` + `RecentTransactions` inside `DashboardLayout`.
- Pure display — no client-side state.

### `/income` — `app/income/page.tsx`
- `"use client"`. Fetches via `GET /api/transactions?type=income` on mount.
- Also fetches `GET /api/user` to get user name for the sidebar.
- Note: uses REST API for reading but server actions for write (create/update via modal).
- Has a subtle inconsistency: income/expense pages are client components that fetch via API, while dashboard is a server component using server actions. The `TransactionFormModal` calls server actions directly regardless.

### `/expense` — `app/expense/page.tsx`
- Identical structure to `/income`, just with `type=expense` and different labels.
- Duplicated fetch logic — no shared hook or utility.

## Component Tree

```
RootLayout
└── SessionProvider (wraps all pages)
    ├── LoginPage / RegisterPage (standalone, no sidebar)
    └── DashboardLayout (sidebar + main)
        ├── Sidebar
        │   └── nav links: /dashboard, /income, /expense + logout
        └── main content
            ├── DashboardPage → SummaryCards + RecentTransactions
            ├── IncomePage → Card (total) + TransactionTable + TransactionFormModal
            └── ExpensePage → Card (total) + TransactionTable + TransactionFormModal
```

## UI Primitives (`components/ui/`)
All hand-rolled, no external component library (no shadcn, no radix, etc.):
- **Button** — variants: primary/secondary/danger/ghost; sizes: sm/md/lg; fullWidth prop
- **Card / CardHeader / CardTitle / CardContent** — simple white box wrappers
- **Input** — forwardRef, label+error props, required asterisk
- **Modal** — fixed overlay, body scroll lock, backdrop click closes, size: sm/md/lg/xl
- **Loading / LoadingButton** — spinner components
- **Sidebar** — uses `usePathname()` for active state, links + logout button

## Styling
- Tailwind CSS v4 (PostCSS plugin). No tailwind.config — uses v4's CSS-first `@import "tailwindcss"` in `globals.css`.
- Fonts: Geist Sans + Geist Mono via `next/font/google`.
- Color theme: blue-600 primary, green for income, red for expense, gray for neutral.
- No dark mode support in the component layer (only CSS var defined in globals).

## Notable Observations
1. `app/layout.tsx` uses `LayoutProps<"/">` — a Next.js 16 generic type, not standard in earlier versions.
2. Income/expense pages call `fetchUserInfo()` on every mount to get the sidebar user name — a redundant round-trip since NextAuth session already holds it client-side.
3. Delete confirmation uses `window.confirm()` — functional but not accessible.
4. No loading/error boundaries at the page level.
5. No pagination on transaction lists — could be slow with large datasets.
6. `formatCurrency` and `formatDate` helpers are duplicated across multiple components — not extracted to a shared utility.
