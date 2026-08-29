# 🔧 Fix Prisma Client Error

## Problem
Error: `Cannot find module '.prisma/client/default'`

Ini berarti Prisma Client belum di-generate. Folder `.prisma` tidak ada di `node_modules`.

## ⚡ Quick Fix (Ikuti Step by Step)

### Step 1: Stop Development Server
Tekan `Ctrl + C` di terminal yang menjalankan `npm run dev`

### Step 2: Pastikan File .env Ada
Buat file `.env` di root folder (sejajar dengan package.json):

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-here"
```

**PENTING:** Untuk sementara, gunakan DATABASE_URL dummy dulu:
```env
DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
```

### Step 3: Generate Prisma Client

**Buka Command Prompt atau PowerShell**, navigasi ke folder project, lalu jalankan:

```bash
npx prisma generate
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client to .\node_modules\.prisma\client in XXms
```

### Step 4: Verify Generation
Check apakah folder sudah ada:

```bash
# Windows Command Prompt
dir node_modules\.prisma\client

# Windows PowerShell
ls node_modules\.prisma\client
```

Jika folder `.prisma` sudah ada, lanjut ke step 5.

### Step 5: Clear Next.js Cache

```bash
# Hapus folder .next
rmdir /s /q .next

# Atau gunakan PowerShell
Remove-Item -Recurse -Force .next
```

### Step 6: Start Development Server

```bash
npm run dev
```

## 🔄 Alternative Fix (Jika Masih Error)

### Option A: Full Clean Install

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Hapus cache dan dependencies
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json

# 3. Install ulang
npm install

# 4. Generate Prisma
npx prisma generate

# 5. Start dev
npm run dev
```

### Option B: Manual Install Prisma

```bash
# 1. Install Prisma CLI
npm install -D prisma

# 2. Install Prisma Client
npm install @prisma/client

# 3. Generate
npx prisma generate

# 4. Restart
npm run dev
```

## 📋 Checklist Troubleshooting

- [ ] File `.env` sudah dibuat di root folder
- [ ] `DATABASE_URL` ada di file `.env` (boleh dummy dulu)
- [ ] Command `npx prisma generate` berhasil tanpa error
- [ ] Folder `node_modules\.prisma\client` sudah ada
- [ ] Folder `.next` sudah dihapus
- [ ] Development server di-restart

## 🎯 Test Setelah Fix

Setelah `npm run dev` berjalan, buka browser ke:
```
http://localhost:3000
```

Jika masih error, lanjut ke Troubleshooting Advanced.

## 🔍 Troubleshooting Advanced

### Error: "Environment variable not found: DATABASE_URL"

Pastikan file `.env` ada dan formatnya benar:
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

Tidak boleh ada spasi sebelum/sesudah `=`

### Error: "Prisma schema could not be found"

Pastikan file `prisma/schema.prisma` ada.

### Error: Port 3000 sudah digunakan

Kill process yang menggunakan port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Atau gunakan port lain
set PORT=3001 && npm run dev
```

### Error lain-lain

1. Restart komputer (serius, sometimes works)
2. Check antivirus tidak block Node.js
3. Pastikan Node.js versi 18+
   ```bash
   node --version
   ```

## 💡 Tips

1. **Setiap kali ubah `schema.prisma`, HARUS run `npx prisma generate` lagi**
2. **Jika masih error, hapus `.next` folder dan restart dev server**
3. **Pastikan tidak ada multiple terminal yang menjalankan dev server**

## ✅ Success Indicators

Aplikasi berhasil jika:
- Dev server start tanpa error
- Browser bisa buka http://localhost:3000
- Redirect ke `/login` (karena belum login)
- Tidak ada error di console

## 🆘 Jika Semua Gagal

Hubungi saya dengan informasi:
1. Output dari `npx prisma generate`
2. Isi file `.env` (tanpa password asli)
3. Node.js version (`node --version`)
4. Error message lengkap

---

**Good luck!** 🚀
