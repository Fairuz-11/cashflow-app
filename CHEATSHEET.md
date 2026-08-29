# 📝 Cashflow App - Cheat Sheet

## 🔐 Login Credentials

```
Email: demo@example.com
Password: password123
```

---

## ⚡ Quick Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build production
npm run start        # Start production server
```

### Database
```bash
npx prisma db push        # Push schema to database
npx prisma generate       # Generate Prisma Client
npx prisma studio         # Open database GUI
npm run prisma:seed       # Seed demo data
npx prisma db push --force-reset  # Reset database
```

### Fix Errors
```bash
fix-prisma-complete.bat   # Fix Prisma errors
rmdir /s /q .next         # Clear Next.js cache
rmdir /s /q node_modules  # Full clean
npm install               # Reinstall
```

---

## 🌐 URLs

```
Local:       http://localhost:3000
Login:       http://localhost:3000/login
Register:    http://localhost:3000/register
Dashboard:   http://localhost:3000/dashboard
Income:      http://localhost:3000/income
Expense:     http://localhost:3000/expense
```

---

## 🗄️ Database Connection

### Neon PostgreSQL
```
Dashboard: https://console.neon.tech
Format: postgresql://user:pass@host/db?sslmode=require
```

### .env File
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

---

## 📁 Important Files

```
.env                    # Environment variables (DO NOT COMMIT)
prisma/schema.prisma    # Database schema
package.json            # Dependencies
next.config.ts          # Next.js config
```

---

## 🐛 Common Errors

### Prisma Error
```bash
fix-prisma-complete.bat
npm run dev
```

### Port 3000 in use
```bash
netstat -ano | findstr :3000
taskkill /PID <NUMBER> /F
```

### DATABASE_URL not found
Check `.env` file exists and has `DATABASE_URL`

### Module not found
```bash
npm install
npx prisma generate
```

---

## 📊 Project Structure

```
cashflow-app/
├── app/              # Pages & API routes
├── components/       # React components
├── lib/              # Utils & server actions
├── prisma/           # Database schema & seed
├── types/            # TypeScript types
└── .env              # Environment variables
```

---

## 🎯 Features

- ✅ Login & Register
- ✅ Dashboard with summary
- ✅ Income management (CRUD)
- ✅ Expense management (CRUD)
- ✅ Auto calculations
- ✅ Responsive design
- ✅ Session management

---

## 📖 Documentation

```
README.md              # Main docs
SETUP.md              # Setup guide
SETUP_DATABASE.md     # Database setup (detailed)
TESTING.md            # Testing checklist
FIX_NOW.md            # Error fixes
QUICK_START.md        # Quick start
```

---

## 💡 Tips

1. Always run `npx prisma generate` after schema changes
2. Clear `.next` folder if weird errors occur
3. Neon free tier auto-sleeps after 5 min
4. Demo login only works after database seed
5. Use `npx prisma studio` to view database GUI

---

## 🆘 Help Resources

- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Tailwind Docs: https://tailwindcss.com/docs

---

## ✅ Setup Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `fix-prisma-complete.bat`
- [ ] Create Neon account
- [ ] Create database project
- [ ] Update `.env` with DATABASE_URL
- [ ] Run `npx prisma db push`
- [ ] Run `npm run prisma:seed`
- [ ] Run `npm run dev`
- [ ] Login with demo credentials

---

**Print or save this for quick reference!** 📌
