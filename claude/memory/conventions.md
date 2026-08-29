# Coding Conventions (Observed)

Patterns actually found in this codebase — not textbook defaults.

## TypeScript
- Strict mode enabled (`"strict": true` in tsconfig)
- `@/*` path alias maps to project root
- NextAuth types augmented in `types/next-auth.d.ts` (Session, User, JWT interfaces)
- Server actions use `"use server"` directive at the top of the file, not per-function

## File & Component Naming
- Pages: `app/<route>/page.tsx`
- Components: PascalCase function exports, kebab-case filenames (`transaction-form-modal.tsx`)
- Lib files: camelCase (`auth.ts`, `prisma.ts`, `session.ts`)

## Component Patterns
- UI primitives are hand-rolled in `components/ui/` — no external component library
- Props interfaces defined inline above each component
- Components that extend HTML element props use `extends HTMLButtonAttributes<...>` pattern
- `forwardRef` used on Input component (not on others)
- Client components use `"use client"` at top of file; server components have no directive

## Data Fetching
- Dashboard page: server components call server actions directly
- Income/expense pages: client components use `useEffect` + `fetch` to call REST API
- Write operations (create/update/delete): always via server actions from any component type
- After a write, call `revalidatePath()` for `/dashboard`, `/income`, `/expense`

## Auth Guards
- `requireAuth()` for anything that needs auth (redirects on failure)
- `getCurrentUser()` when auth is optional (returns undefined on failure)
- Both are called at the top of any protected server component or server action

## Error Handling
- Server actions return `{ success: boolean, error?: string }` — never throw to client
- API routes wrap everything in try/catch, return appropriate status codes
- Zod errors extract `error.errors[0].message` for user-facing messages
- Client components show inline error messages in red box UI (not toasts)

## Styling
- Tailwind CSS v4 with no config file — CSS-first approach
- Color conventions: blue-600 = brand/primary, green-600 = income, red-600 = expense
- Inline SVG icons (no icon library)
- Responsive grid: `grid-cols-1 md:grid-cols-3` for summary cards

## Currency & Dates
- Always `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })`
- Always `Intl.DateTimeFormat("id-ID", { day: "numeric", month: "...", year: "numeric" })`
- These are duplicated per-component (known tech debt — see 05-risks-and-tech-debt.md #10)

## Prisma
- Singleton client via `globalThis` in `lib/prisma.ts`
- `amount` is always converted from Decimal to number with `Number(t.amount)` after every query
- Ownership checked before update/delete: `findFirst({ where: { id, userId } })`

## Validation
- Zod schemas defined close to their use (inline in API route files, exported from server actions file)
- `transactionSchema` is exported from `lib/actions/transaction.ts` for reuse
