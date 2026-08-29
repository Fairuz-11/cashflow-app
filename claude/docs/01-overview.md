# 01 — Project Overview

## What This Is

Cashflow is a personal finance tracker built for Indonesian users. It lets a registered user record income (uang masuk) and expenses (uang keluar), then view a running summary of total income, total expense, and profit. The UI and all labels are in Bahasa Indonesia; amounts are displayed in IDR.

## Architecture

A **Next.js 16 App Router monolith** with a PostgreSQL database accessed through Prisma ORM. There is no separate backend service — the Next.js app serves both the frontend and the API surface. Authentication is handled by NextAuth v4 with a JWT strategy and a credentials-only provider (email + password).

```
Browser
  └── Next.js App Router (port 3000)
        ├── Server Components (dashboard page)
        ├── Client Components (income, expense, login, register pages)
        ├── API Routes (/api/*)
        ├── Server Actions (lib/actions/transaction.ts)
        └── Prisma Client
              └── PostgreSQL
```

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16.3.3 (App Router) |
| UI runtime | React 19.2.8 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Auth | NextAuth v4 (credentials + JWT, PrismaAdapter) |
| ORM | Prisma 5.22 |
| Database | PostgreSQL (external, URL via env) |
| Validation | Zod v4 |
| Password hashing | bcryptjs (10 rounds) |
| Fonts | Geist Sans + Geist Mono via next/font/google |
| UI components | Hand-rolled (no shadcn/radix/MUI) |

## User Flows

1. **Registration:** `/register` → `POST /api/auth/register` → redirect to `/login`
2. **Login:** `/login` → NextAuth `signIn("credentials")` → JWT cookie → redirect to `/dashboard`
3. **Dashboard:** server-rendered summary + last 10 transactions
4. **Income/Expense pages:** client-side fetch of filtered transaction list, modal form for add/edit, inline delete
5. **Logout:** `signOut()` from sidebar → redirect to `/login`

## Route Structure

| URL | Type | Auth Required | Description |
|---|---|---|---|
| `/` | Server Component | No | Redirects to /dashboard or /login |
| `/login` | Client Component | No | Credentials login form |
| `/register` | Client Component | No | New user registration form |
| `/dashboard` | Server Component | Yes | Summary cards + recent transactions |
| `/income` | Client Component | Yes | Income list + CRUD |
| `/expense` | Client Component | Yes | Expense list + CRUD |
| `/api/auth/[...nextauth]` | API Route | No | NextAuth handler (GET + POST) |
| `/api/auth/register` | API Route | No | User registration (POST) |
| `/api/transactions` | API Route | Yes | Read transactions (GET) |
| `/api/user` | API Route | Yes | Read current user info (GET) |

## Environment Variables Required

```
DATABASE_URL        # PostgreSQL connection string
NEXTAUTH_URL        # App URL (e.g. http://localhost:3000)
NEXTAUTH_SECRET     # Random secret for JWT signing
```

## Current State (as of initial analysis)

The project is functionally complete for its stated scope — registration, login, and full CRUD for income/expense transactions all work. However, the entire implementation exists only as uncommitted files on top of a 3-commit git history that ends at the Next.js scaffold. No production deployment configuration exists.
