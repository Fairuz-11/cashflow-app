# 🚀 Quick Start - Cashflow Simple

## ⚡ Fastest Way to Fix & Run

### Option 1: Automatic Fix (Recommended)

**Windows Command Prompt:**
```bash
fix-prisma.bat
```

**Windows PowerShell:**
```bash
.\fix-prisma.ps1
```

Setelah selesai, jalankan:
```bash
npm run dev
```

### Option 2: Manual Fix (3 Commands)

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Clear cache
rmdir /s /q .next

# 3. Start dev server
npm run dev
```

## 📋 Pre-requisites

1. **Node.js 18+** installed
2. **File `.env`** must exist (created automatically by script)

## 🔧 If Still Error

### Error: "DATABASE_URL not found"

Create `.env` file:
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-32-char-string"
```

For testing, you can use dummy DATABASE_URL:
```env
DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require"
```

### Error: "Port 3000 already in use"

Kill the process:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or use different port:
```bash
set PORT=3001
npm run dev
```

## ✅ Success Check

App is running if:
- Terminal shows: `✓ Ready in X.Xs`
- Browser opens: `http://localhost:3000`
- Redirects to `/login` page
- No errors in console

## 🎯 Next Steps

1. **Setup Real Database:**
   - Sign up at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string to `.env`
   - Run: `npx prisma db push`
   - Run: `npm run prisma:seed`

2. **Login with Demo:**
   ```
   Email: demo@example.com
   Password: password123
   ```

3. **Start Using:**
   - View dashboard
   - Add income/expense
   - Manage transactions

## 📚 Full Documentation

- **SETUP.md** - Complete setup guide
- **TESTING.md** - Testing checklist  
- **README.md** - Full documentation
- **FIX_PRISMA_ERROR.md** - Detailed error fix guide

## 🆘 Still Stuck?

Read `FIX_PRISMA_ERROR.md` for detailed troubleshooting.

---

**Let's get your app running!** 🚀
