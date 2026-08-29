# Phase 0 — Recon Notes

## Git History
- **Repo age:** 3 commits total on `main` branch
- **Commits:**
  - `41097ca` (HEAD) — "Merge remote repository"
  - `b148c65` — "Initial commit from Create Next App"
  - `e108d18` — "Initial commit"
- **Working tree state:** Large volume of uncommitted files — the entire application was built on top of the Next.js scaffold but never committed. Everything in `app/api/`, `app/dashboard/`, `app/expense/`, `app/income/`, `app/login/`, `app/register/`, `components/`, `lib/`, `prisma/`, `types/` is untracked.
- **Current branch:** `main` (also tracked at `origin/main`, `origin/HEAD`)

## Architecture Shape
Single-repo full-stack web app: **Next.js App Router monolith** with a PostgreSQL backend accessed through Prisma ORM.

## Languages / Frameworks / Versions
| Package | Version |
|---|---|
| next | 16.3.3 (App Router) |
| react / react-dom | 19.2.8 |
| next-auth | ^4.24.15 |
| @auth/prisma-adapter | ^2.11.3 |
| @prisma/client | ^5.22.0 |
| prisma (devDep) | ^5.22.0 |
| tailwindcss | ^4 |
| @tailwindcss/postcss | ^4 |
| zod | ^4.4.3 |
| bcryptjs | ^3.0.3 |
| typescript | ^5 |

## Build & Tooling
- **Dev server:** `next dev`
- **Build:** `next build`
- **Lint:** `eslint` (ESLint 9, eslint-config-next 16.3.3)
- **DB commands:** `prisma generate`, `prisma migrate dev`, `prisma db push`, `prisma db seed`
- **Seed runner:** `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts`
- **No CI/CD configuration** found in repo

## Project Purpose
Indonesian-language personal cashflow tracker. UI and labels are in Bahasa Indonesia. Currency is IDR. Target users: individuals tracking their own income/expenses.

## Directory Map
```
cashflow-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout — wraps in SessionProvider + Geist fonts
│   ├── page.tsx            # / — redirects to /dashboard or /login
│   ├── globals.css         # Tailwind v4 import + CSS vars
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── register/route.ts        # POST /api/auth/register
│   │   ├── transactions/route.ts        # GET /api/transactions
│   │   └── user/route.ts                # GET /api/user
│   ├── dashboard/page.tsx   # Summary + recent transactions (server component)
│   ├── income/page.tsx      # Income list + CRUD (client component)
│   ├── expense/page.tsx     # Expense list + CRUD (client component)
│   ├── login/page.tsx       # Login form (client component)
│   └── register/page.tsx    # Register form (client component)
├── components/
│   ├── dashboard/           # SummaryCards, RecentTransactions
│   ├── layout/              # DashboardLayout (sidebar wrapper)
│   ├── providers/           # SessionProvider wrapper
│   ├── transactions/        # TransactionFormModal, TransactionTable
│   └── ui/                  # Button, Card, Input, Loading, Modal, Sidebar
├── lib/
│   ├── auth.ts              # NextAuth config (authOptions)
│   ├── prisma.ts            # Prisma singleton client
│   ├── session.ts           # getCurrentUser(), requireAuth()
│   └── actions/
│       └── transaction.ts   # Server actions: CRUD + getSummary + getRecent
├── prisma/
│   ├── schema.prisma        # DB schema
│   └── seed.ts              # Demo data seeder
└── types/
    └── next-auth.d.ts       # Session/JWT type augmentation
```
