# Decisions Log (Newest First)

---

## 2026-08-29 — Initial analysis session

No architectural decisions were made during this session — this was a read-only analysis pass. Decisions discovered from the codebase are documented below as "observed decisions."

### Observed: JWT over database sessions
NextAuth is configured with `session.strategy: "jwt"` despite PrismaAdapter being present. This means session data lives in a signed cookie rather than the DB. Tradeoff: faster session reads (no DB query), but the adapter's Session table is effectively unused, and user profile changes are not reflected until re-login.

### Observed: Hand-rolled UI components
No external component library (no shadcn, radix, MUI, etc.). All UI primitives in `components/ui/` are custom-built. Tradeoff: no dependency on a component library's upgrade cycle, but accessibility features (focus management, ARIA) must be handled manually.

### Observed: Mixed SSR/CSR data fetching
Dashboard page uses server components + server actions (SSR). Income/expense pages use client components + REST API (CSR). No explicit decision record — this inconsistency appears to be an organic result of building the pages at different times rather than a deliberate architectural choice.

### Observed: Credentials-only auth
Only email/password login is supported. No OAuth providers. Password reset is not implemented.

### Observed: Server actions for mutations, REST for reads on client pages
Transaction creates/updates/deletes go through server actions. Reads on the income/expense client pages go through the REST API. The dashboard reads go through server actions (as it is a server component). This split means there's no single consistent data access pattern.
