# 🗄️ Setup Database Neon PostgreSQL - Panduan Lengkap

## 📋 Overview

Panduan ini akan membantu Anda:
1. ✅ Membuat akun Neon PostgreSQL (gratis)
2. ✅ Membuat database project
3. ✅ Mendapatkan connection string
4. ✅ Menghubungkan ke aplikasi
5. ✅ Push database schema
6. ✅ Seed data demo

**Estimasi waktu: 5-10 menit**

---

## 🚀 Step 1: Daftar Akun Neon

### 1.1 Buka Website Neon
- URL: **https://neon.tech**
- Klik tombol **"Sign Up"** di kanan atas

### 1.2 Pilih Metode Sign Up
Anda bisa pilih salah satu:
- **GitHub** (paling cepat, recommended)
- **Google**
- **Email**

### 1.3 Verify Email (Jika pakai email)
- Cek inbox email Anda
- Klik link verifikasi
- Login ke dashboard

---

## 🏗️ Step 2: Buat Project Baru

### 2.1 Di Dashboard Neon
Setelah login, Anda akan melihat dashboard Neon.

### 2.2 Create New Project
1. **Klik tombol "New Project"** (atau "Create Project")
2. **Isi form:**
   - **Project Name**: `cashflow-app` (atau nama bebas)
   - **Region**: Pilih **Asia Pacific (Singapore)** ✅ (paling dekat)
   - **PostgreSQL Version**: Biarkan default (latest)
   - **Compute Size**: Free tier (0.25 vCPU) ✅

3. **Klik "Create Project"**

### 2.3 Tunggu Provisioning
- Project akan dibuat dalam beberapa detik
- Anda akan dialihkan ke project dashboard

---

## 🔑 Step 3: Dapatkan Connection String

### 3.1 Di Project Dashboard
Setelah project dibuat, Anda akan melihat **Connection Details**.

### 3.2 Copy Connection String

**PENTING:** Pilih **Prisma** di dropdown!

```
┌─────────────────────────────────────────┐
│ Connection Details                       │
├─────────────────────────────────────────┤
│ Framework: [Prisma ▼]                   │ ← PILIH INI
├─────────────────────────────────────────┤
│ Connection String:                       │
│ postgresql://username:password@...       │
│ [Copy] 📋                               │
└─────────────────────────────────────────┘
```

**Klik tombol "Copy"** atau copy manual.

### 3.3 Format Connection String
Connection string akan terlihat seperti:

```
postgresql://neondb_owner:AbCdEf123456@ep-cool-name-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Penjelasan:**
- `neondb_owner` = username
- `AbCdEf123456` = password (generated otomatis)
- `ep-cool-name-12345...` = host
- `neondb` = database name
- `?sslmode=require` = SSL required (harus ada)

---

## 🔧 Step 4: Update File .env

### 4.1 Buka File .env
Di folder project Anda, buka file `.env`

**Lokasi:** `C:\Users\athoi\USER\cashflow-app\.env`

### 4.2 Update DATABASE_URL

**SEBELUM:**
```env
DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
```

**SESUDAH:**
```env
DATABASE_URL="postgresql://neondb_owner:AbCdEf123456@ep-cool-name-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
```

**Replace dengan connection string Anda yang dicopy dari Neon!**

### 4.3 Save File
- Tekan `Ctrl + S` untuk save
- Close file

---

## 📤 Step 5: Push Schema ke Database

### 5.1 Buka Command Prompt
Buka Command Prompt di folder project.

### 5.2 Push Schema
Jalankan command:

```bash
npx prisma db push
```

### 5.3 Expected Output

```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

🚀  Your database is now in sync with your Prisma schema. Done in XXXms

✔ Generated Prisma Client to .\node_modules\.prisma\client in XXms
```

**Jika muncul error**, lanjut ke Troubleshooting di bawah.

### 5.4 Verify di Neon Dashboard

Kembali ke Neon dashboard:
1. Klik tab **"Tables"**
2. Anda akan melihat tables:
   - `users`
   - `transactions`
   - `accounts`
   - `sessions`
   - `verification_tokens`

**Jika tables muncul = SUCCESS!** ✅

---

## 🌱 Step 6: Seed Data Demo

### 6.1 Install ts-node (Jika Belum)
```bash
npm install -D ts-node
```

### 6.2 Run Seed Script
```bash
npm run prisma:seed
```

**ATAU:**
```bash
npx ts-node prisma/seed.ts
```

### 6.3 Expected Output

```
🌱 Starting seed...
🗑️  Cleared existing data
👤 Created demo user: demo@example.com
💰 Created 17 sample transactions

📊 Summary:
   Income: 5 transactions, Total: Rp 24,000,000
   Expense: 12 transactions, Total: Rp 14,320,000
   Profit: Rp 9,680,000

✅ Seed completed successfully!

🔐 Login credentials:
   Email: demo@example.com
   Password: password123
```

**Jika muncul output ini = SUCCESS!** ✅

---

## ✅ Step 7: Test Aplikasi

### 7.1 Start Development Server
```bash
npm run dev
```

### 7.2 Buka Browser
```
http://localhost:3000
```

### 7.3 Login dengan Demo User
```
Email: demo@example.com
Password: password123
```

### 7.4 Cek Dashboard
Setelah login, Anda akan melihat:
- ✅ Total Uang Masuk: Rp 24,000,000
- ✅ Total Uang Keluar: Rp 14,320,000
- ✅ Profit: Rp 9,680,000
- ✅ 10 transaksi terbaru

**Jika semuanya muncul = APLIKASI BERHASIL!** 🎉

---

## 🐛 Troubleshooting

### Error: "Connection refused" atau "Connection timeout"

**Penyebab:**
- Connection string salah
- Internet connection issue
- Neon database sleep (free tier)

**Solusi:**
1. **Cek connection string** di `.env` benar
2. **Wake up database:**
   - Buka Neon dashboard
   - Klik project Anda
   - Database akan auto-wake up
3. **Test connection:**
   ```bash
   npx prisma db push --force-reset
   ```

### Error: "P1001: Can't reach database server"

**Solusi:**
1. Pastikan `?sslmode=require` ada di connection string
2. Cek firewall/antivirus tidak block
3. Coba connection string yang lain (Neon punya multiple formats)

### Error: "P1017: Server has closed the connection"

**Solusi:**
Free tier Neon auto-sleep setelah 5 menit inactive.
- Buka Neon dashboard (database akan wake up)
- Tunggu 10-20 detik
- Coba lagi `npx prisma db push`

### Error: "P3005: Database not found"

**Solusi:**
Database name di connection string salah.
- Check di Neon dashboard → Connection Details
- Database name biasanya: `neondb` atau sesuai project name

### Error saat Seed: "Cannot find module 'ts-node'"

**Solusi:**
```bash
npm install -D ts-node @types/node
npm run prisma:seed
```

### Error: "Prisma schema validation failed"

**Solusi:**
```bash
npx prisma format
npx prisma validate
npx prisma db push
```

---

## 💡 Tips & Best Practices

### 1. Free Tier Limitations
- **Storage:** 512 MB (cukup untuk ribuan transaksi)
- **Compute time:** 191 hours/month (cukup untuk development)
- **Auto-sleep:** Database sleep setelah 5 menit inactive
- **Concurrent connections:** 1 connection

### 2. Keep Database Active
Untuk development, database sleep itu normal. Akan auto-wake saat ada request.

### 3. Backup Connection String
Simpan connection string di tempat aman (password manager).

### 4. Production Setup
Untuk production, consider:
- Upgrade ke paid plan (no sleep, more resources)
- Separate database untuk production vs development
- Setup automated backups

### 5. Monitor Usage
Check usage di Neon dashboard:
- Dashboard → Usage
- Monitor storage, compute hours, data transfer

---

## 🔐 Security Notes

### ⚠️ JANGAN:
- ❌ Commit file `.env` ke Git (sudah di `.gitignore`)
- ❌ Share connection string di public
- ❌ Hardcode password di code
- ❌ Use same database untuk dev & production

### ✅ DO:
- ✅ Use `.env` untuk credentials
- ✅ Generate strong `NEXTAUTH_SECRET`
- ✅ Separate database per environment
- ✅ Regular backups (Neon has auto-backup on paid plans)

---

## 📊 What's in the Seed Data?

### Demo User
```
Email: demo@example.com
Password: password123
Name: Demo User
```

### Income Transactions (5)
1. Gaji Bulan Januari - Rp 8,500,000
2. Bonus Proyek - Rp 2,000,000
3. Freelance Web Design - Rp 3,500,000
4. Gaji Bulan Februari - Rp 8,500,000
5. Dividen Investasi - Rp 1,500,000

**Total Income: Rp 24,000,000**

### Expense Transactions (12)
1. Sewa Rumah - Rp 3,000,000
2. Belanja Bulanan - Rp 2,500,000
3. Listrik & Air - Rp 450,000
4. Internet - Rp 350,000
5. Bensin - Rp 500,000
6. Makan di Restoran - Rp 350,000
7. Belanja Pakaian - Rp 800,000
8. Asuransi Kesehatan - Rp 500,000
9. Sewa Rumah (Feb) - Rp 3,000,000
10. Belanja Bulanan (Feb) - Rp 2,200,000
11. Listrik & Air (Feb) - Rp 420,000
12. Service Motor - Rp 250,000

**Total Expense: Rp 14,320,000**

### Summary
- **Profit: Rp 9,680,000**
- **Time Range:** January - February 2024

---

## 🎯 Verification Checklist

Setup berhasil jika:
- [ ] Akun Neon terdaftar
- [ ] Project dibuat
- [ ] Connection string copied
- [ ] File `.env` updated
- [ ] `npx prisma db push` berhasil
- [ ] Tables muncul di Neon dashboard
- [ ] `npm run prisma:seed` berhasil
- [ ] Demo user bisa login
- [ ] Dashboard menampilkan data seed

---

## 🆘 Need More Help?

### Neon Documentation
- https://neon.tech/docs/introduction
- https://neon.tech/docs/connect/connect-from-any-app

### Prisma Documentation
- https://www.prisma.io/docs/getting-started
- https://www.prisma.io/docs/concepts/components/prisma-client

### Video Tutorial (Neon)
- YouTube: "Neon PostgreSQL Tutorial"
- Neon YouTube channel

---

## 🎉 Success! What's Next?

Setelah database setup berhasil:

1. **Explore aplikasi** - Test semua fitur CRUD
2. **Tambah transaksi sendiri** - Buat data real Anda
3. **Customize** - Ubah sesuai kebutuhan
4. **Deploy** - Ready untuk production (lihat README.md)

---

## 📝 Quick Reference

### Database Info
- **Provider:** Neon PostgreSQL
- **Region:** Asia Pacific (Singapore)
- **Plan:** Free Tier
- **Storage:** 512 MB
- **Compute:** 191 hours/month

### Commands Sering Dipakai
```bash
# Push schema changes
npx prisma db push

# Open Prisma Studio (GUI database)
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Seed data
npm run prisma:seed

# Generate Prisma Client
npx prisma generate
```

### Connection String Format
```
postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

---

**Selamat! Database Anda siap digunakan!** 🚀

Sekarang aplikasi Cashflow Simple Anda fully functional dengan database real!
