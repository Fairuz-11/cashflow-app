# claude/docs — Index

Current-truth architecture documentation. Read in order for a full understanding, or jump to the relevant doc.

| # | File | Contents |
|---|---|---|
| 01 | [01-overview.md](01-overview.md) | What the app is, tech stack, route table, environment variables, current state |
| 02 | [02-auth.md](02-auth.md) | NextAuth config, JWT strategy, session shape, registration flow, known auth issues |
| 03 | [03-data-layer.md](03-data-layer.md) | DB schema, Prisma singleton, server actions reference, seed data |
| 04 | [04-frontend.md](04-frontend.md) | Page rendering strategy, component tree, CRUD flow, styling conventions |
| 05 | [05-risks-and-tech-debt.md](05-risks-and-tech-debt.md) | 14 identified issues with severity ratings and fix effort |
| 06 | [06-glossary.md](06-glossary.md) | Indonesian UI terms and project-specific vocabulary |

## Diagrams
- [diagrams/01-data-flow.mmd](../diagrams/01-data-flow.mmd) — Mermaid: browser → Next.js → Prisma → DB request flow
- [diagrams/02-db-erd.mmd](../diagrams/02-db-erd.mmd) — Mermaid: entity relationship diagram

## Extracted Artifacts
- [files/api-contracts.md](../files/api-contracts.md) — REST API request/response shapes + server action signatures

## Memory (Persistent Facts)
- [memory/state.md](../memory/state.md) — Current git checkpoint and project orientation (read this first each session)
- [memory/conventions.md](../memory/conventions.md) — Observed coding conventions
- [memory/glossary.md](../memory/glossary.md) — Quick-reference term list
- [memory/decisions.md](../memory/decisions.md) — Architectural decisions log
- [memory/changelog.md](../memory/changelog.md) — Running log of doc updates

## Task Backlog
- [tasks/backlog.md](../tasks/backlog.md) — Prioritized actionable items

## Session Logs
- [sessions/2026-08-29-initial-analysis.md](../sessions/2026-08-29-initial-analysis.md) — First run
