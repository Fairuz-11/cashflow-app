# API Contracts

All endpoints base URL: `/api`

---

## `GET /api/transactions`

**Auth:** Required (JWT session). Returns 307 redirect to `/login` if unauthenticated (see risk #1 in 05-risks-and-tech-debt.md).

**Query params:**
- `type` (optional): `"income"` | `"expense"` — omit to return all

**Response 200:**
```json
[
  {
    "id": "clxxxxxxx",
    "type": "income",
    "description": "Gaji Bulan Januari",
    "amount": 8500000,
    "transactionDate": "2024-01-05T00:00:00.000Z",
    "userId": "clxxxxxxx",
    "createdAt": "2024-01-05T10:00:00.000Z",
    "updatedAt": "2024-01-05T10:00:00.000Z"
  }
]
```

**Response 500:**
```json
{ "error": "Failed to fetch transactions" }
```

---

## `POST /api/auth/register`

**Auth:** None (public)

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validation:** name ≥ 2 chars, valid email format, password ≥ 6 chars

**Response 201:**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": "clxxxxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-05T10:00:00.000Z"
  }
}
```

**Response 400** (duplicate email):
```json
{ "error": "Email sudah terdaftar" }
```

**Response 400** (validation error):
```json
{ "error": "<first Zod error message>" }
```

**Response 500:**
```json
{ "error": "Terjadi kesalahan saat registrasi" }
```

---

## `GET /api/user`

**Auth:** Required (JWT session). Returns 307 redirect if unauthenticated.

**Response 200:**
```json
{
  "id": "clxxxxxxx",
  "name": "John Doe",
  "email": "john@example.com"
}
```

Note: Data is read from the JWT token, not from the DB. Stale if user profile was updated without re-login.

**Response 401** (only if error thrown):
```json
{ "error": "Unauthorized" }
```

---

## Server Actions (direct function calls, not HTTP)

Located in `lib/actions/transaction.ts`. Called from client components via React Server Actions protocol.

| Function | Input | Returns |
|---|---|---|
| `getSummary()` | none | `{totalIncome: number, totalExpense: number, profit: number}` |
| `getRecentTransactions(limit)` | `limit: number` | `Transaction[]` (amount as number) |
| `createTransaction(data)` | `{type, description, amount, transactionDate}` | `{success: true, transaction}` or `{success: false, error: string}` |
| `updateTransaction(id, data)` | `id: string` + same data | same as create |
| `deleteTransaction(id)` | `id: string` | `{success: true}` or `{success: false, error: string}` |
