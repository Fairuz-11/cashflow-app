# 06 — Glossary

Domain and project-specific terms used in this codebase. Indonesian terms appear as used in the UI; their English equivalents are noted.

| Term | Context | Meaning |
|---|---|---|
| **Cashflow** | App name | The application itself — a personal finance cashflow tracker |
| **Uang Masuk** | UI label | "Money In" — the income category; maps to `type: "income"` in DB |
| **Uang Keluar** | UI label | "Money Out" — the expense category; maps to `type: "expense"` |
| **Rekap** | UI label | "Summary/Recap" — the dashboard page showing totals |
| **Pemasukan** | UI label | "Income" — used in form/table labels and transaction type badges |
| **Pengeluaran** | UI label | "Expenses/Expenditure" — used in form/table labels |
| **Profit** | UI label | Net balance (totalIncome − totalExpense); shown in dashboard summary card |
| **Keterangan** | UI field | "Description" — the transaction description field |
| **Nominal** | UI field | "Amount" — the transaction amount field |
| **Tanggal** | UI field | "Date" — the transaction date field |
| **TransactionType** | Prisma enum | `income \| expense` — the two valid transaction types |
| **transactionDate** | DB field | The user-recorded date of the transaction (not `createdAt`) — mapped column `transaction_date` |
| **requireAuth()** | lib/session | Server-side guard that redirects to `/login` if no session; used in server components, server actions, and API routes |
| **getCurrentUser()** | lib/session | Returns `session?.user` or undefined — safe, no redirect |
| **authOptions** | lib/auth | The NextAuth configuration object — exported and used by the [...nextauth] route and `getServerSession()` |
| **Server Action** | Next.js concept | Functions marked `"use server"` in `lib/actions/transaction.ts` — called directly from client components, executed on the server |
| **PrismaAdapter** | NextAuth | Adapter connecting NextAuth to the Prisma/PostgreSQL backend for storing Account/Session/VerificationToken models |
| **cuid** | Prisma | "Collision-resistant unique identifier" — the ID format used for all model PKs |
| **revalidatePath** | Next.js | Invalidates the Next.js route cache for a given path, causing the next request to fetch fresh data |
| **IDR** | Currency | Indonesian Rupiah — all amounts are in this currency |
| **demo@example.com** | Seed data | Demo user created by `prisma/seed.ts`; password is `password123` |
