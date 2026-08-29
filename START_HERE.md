# 🎯 START HERE - Langkah Demi Langkah

Ikuti langkah ini secara berurutan untuk menjalankan aplikasi.

---

## 📍 Step 1: Fix Prisma Error (5 menit)

### ✅ Action:
Buka **Command Prompt** di folder project, jalankan:

```bash
fix-prisma-complete.bat
```

### ✅ Tunggu sampai muncul:
```
============================================
   SUCCESS! FIX COMPLETED!
============================================
```

### ❌ Jika gagal:
Jalankan manual:
```bash
npm uninstall prisma @prisma/client
npm install -D prisma@5.22.0
npm install @prisma/client@5.22.0
npx prisma generate
```

**📖 Detail:** Lihat `FIX_NOW.md`

---

## 📍 Step 2: Setup Database Neon (10 menit)

### ✅ Action:
1. **Buka browser** → https://neon.tech
2. **Sign up** (pilih GitHub/Google/Email)
3. **Create New Project:**
   - Name: `cashflow-app`
   - Region: **Asia Pacific (Singapore)**
   - Klik "Create"

4. **Copy Connection String:**
   - Pilih **"Prisma"** di dropdown
   - Klik **"Copy"** button
   
   Format:
   ```
   postgresql://user:pass@host.neon.tech/db?sslmode=require
   ```

5. **Update .env:**
   - Buka file `.env` di folder project
   - Ganti `DATABASE_URL` dengan connection string yang dicopy
   - Save file

**📖 Detail:** Lihat `SETUP_DATABASE.md` (lengkap dengan screenshot)

---

## 📍 Step 3: Push Schema ke Database (2 menit)

### ✅ Action:
Di Command Prompt, jalankan:

```bash
npx prisma db push
```

### ✅ Tunggu sampai muncul:
```
🚀 Your database is now in sync with your Prisma schema.
```

### ✅ Verify di Neon:
- Buka Neon dashboard
- Tab "Tables" → Harus muncul 5 tables

---

## 📍 Step 4: Seed Data Demo (1 menit)

### ✅ Action:
Jalankan:

```bash
npm run prisma:seed
```

### ✅ Tunggu sampai muncul:
```
✅ Seed completed successfully!

🔐 Login credentials:
   Email: demo@example.com
   Password: password123
```

### ❌ Jika error "Cannot find ts-node":
```bash
npm install -D ts-node
npm run prisma:seed
```

---

## 📍 Step 5: Start Aplikasi (1 menit)

### ✅ Action:
Jalankan:

```bash
npm run dev
```

### ✅ Tunggu sampai muncul:
```
▲ Next.js 16.3.3
- Local: http://localhost:3000

✓ Ready in X.Xs
```

---

## 📍 Step 6: Login & Test (2 menit)

### ✅ Action:
1. **Buka browser** → http://localhost:3000
2. **Login dengan:**
   ```
   Email: demo@example.com
   Password: password123
   ```

3. **Cek Dashboard:**
   - Total Uang Masuk: **Rp 24,000,000** ✅
   - Total Uang Keluar: **Rp 14,320,000** ✅
   - Profit: **Rp 9,680,000** ✅
   - Riwayat transaksi tampil ✅

4. **Test Fitur:**
   - Klik "Uang Masuk" → Tambah transaksi baru
   - Klik "Uang Keluar" → Edit/Hapus transaksi
   - Cek Dashboard update otomatis

---

## 🎉 SUCCESS!

Jika semua step di atas berhasil, aplikasi Anda sudah **fully functional**!

---

## 🔄 Untuk Menjalankan Lagi Nanti

```bash
# 1. Buka Command Prompt di folder project
# 2. Jalankan:
npm run dev

# 3. Buka browser:
http://localhost:3000

# 4. Login dengan demo account
```

**Selesai!** ✅

---

## ❓ Troubleshooting Quick Links

| Error | Fix File |
|-------|----------|
| Prisma error | `FIX_NOW.md` |
| Database error | `SETUP_DATABASE.md` |
| General setup | `SETUP.md` |
| Commands | `CHEATSHEET.md` |

---

## 📊 Progress Checklist

Track your progress:

```
Step 1: Fix Prisma          [ ]
Step 2: Setup Database      [ ]
Step 3: Push Schema         [ ]
Step 4: Seed Data           [ ]
Step 5: Start App           [ ]
Step 6: Login & Test        [ ]
```

Copy this dan check satu per satu! ✓

---

## 💡 Pro Tips

1. **Keep terminal open** saat dev server running
2. **Ctrl+C** untuk stop dev server
3. **Refresh browser** jika data tidak update
4. **Check .env file** jika database error
5. **Run `npx prisma studio`** untuk lihat database GUI

---

## 🆘 Still Stuck?

### Quick Fixes:

**1. Prisma Error?**
```bash
fix-prisma-complete.bat
```

**2. Port Error?**
```bash
taskkill /F /IM node.exe
npm run dev
```

**3. Database Error?**
```bash
# Check .env file
# Wake up Neon database (buka dashboard)
npx prisma db push
```

**4. Module Not Found?**
```bash
npm install
npx prisma generate
npm run dev
```

**5. Nuclear Option (Full Reset):**
```bash
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json
npm install
npx prisma generate
npm run dev
```

---

## 📖 Full Documentation

Untuk penjelasan lebih detail, buka file-file ini:

1. **README.md** - Overview aplikasi
2. **SETUP_DATABASE.md** - Setup database lengkap
3. **TESTING.md** - Testing checklist
4. **CHEATSHEET.md** - Quick reference
5. **FIX_NOW.md** - Error fixes

---

**Mulai dari Step 1 sekarang!** 🚀

Estimasi total waktu: **20 menit**

Good luck! 💪
