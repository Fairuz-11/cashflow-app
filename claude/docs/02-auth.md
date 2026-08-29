# 02 — Authentication & Session

## Strategy

NextAuth v4 with **JWT sessions** and a single **CredentialsProvider**. No OAuth providers are configured.

## Configuration (`lib/auth.ts`)

- `session.strategy: "jwt"` — sessions live in a signed cookie, not the database
- PrismaAdapter is attached but its session table is not used for the JWT strategy; the adapter is present to support the `Account` and `VerificationToken` models (useful if OAuth is added later)
- JWT callback: `token.id = user.id` on sign-in
- Session callback: `session.user.id = token.id`
- Custom pages: all auth errors and redirects point to `/login`

## Session Shape

After login, `session.user` contains:

```typescript
{
  id: string      // cuid from DB
  name: string | null
  email: string
  image: string | null
}
```

Type augmentation is in `types/next-auth.d.ts`.

## Server-side Session Access

`lib/session.ts` provides two helpers:

```typescript
getCurrentUser()   // returns session?.user or undefined — safe, no redirect
requireAuth()      // redirects to /login if not authenticated
```

`requireAuth()` is used in all protected server components, server actions, and API routes.

## Password Handling

- Stored as bcrypt hash with salt rounds = 10
- `bcryptjs` (pure JS implementation — no native bindings required)
- Registration validates password min length (6 chars) both client-side and server-side (Zod)
- There is no password reset flow

## Registration Flow

1. `POST /api/auth/register` with `{name, email, password}`
2. Zod validates: name ≥ 2 chars, valid email, password ≥ 6 chars
3. Checks for existing email (returns 400 if duplicate)
4. bcrypt.hash(password, 10)
5. `prisma.user.create(...)` — returns `{id, name, email, createdAt}` (password excluded via `select`)
6. Client redirects to `/login?registered=true` — but the login page does NOT read this param, so no success message is shown

## Known Issues

1. **`requireAuth()` in API routes returns a redirect (307) instead of 401** — `redirect()` from Next.js navigation is not appropriate in API route handlers. An unauthenticated `fetch("/api/transactions")` will receive a redirect response, not a JSON error. Client code currently ignores the error case.

2. **`GET /api/user` reads from JWT, not DB** — name/email changes are not reflected until re-login.

3. **No `?registered=true` handling in login page** — post-registration success message never shows.

4. **No rate limiting on auth endpoints** — `/api/auth/register` and the NextAuth credentials endpoint have no brute-force protection.

5. **No password reset** — users who forget their password have no recovery path.
