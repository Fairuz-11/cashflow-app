@AGENTS.md

---

## Persistent Memory Protocol

This project uses a `claude/` folder at the repo root as persistent working memory across sessions.

**Start every session by reading:**
1. `claude/memory/state.md` — current git checkpoint and project orientation
2. `claude/docs/00-INDEX.md` — map of all architecture docs

**Standing protocol (every session):**
- At session end, write `claude/sessions/YYYY-MM-DD-<topic>.md` summarising what happened
- Update `claude/memory/state.md` with the new git HEAD and a pointer to the session file
- Append to `claude/memory/changelog.md`
- If architecture changed, update the relevant `claude/docs/NN-*.md` — docs are current-truth, not a diary
- Any decision made → `claude/memory/decisions.md` (newest first)
- Any new convention observed → `claude/memory/conventions.md`

**This is a first-time paste — the protocol runs automatically from here on.** Do not re-run the full deep analysis unless `claude/` is missing.
