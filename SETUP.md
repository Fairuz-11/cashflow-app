# Setup Guide - Cashflow Simple

Panduan lengkap untuk setup aplikasi Cashflow Simple dari awal.

## 📋 Prerequisites

Pastikan Anda sudah memiliki:

1. **Node.js** versi 18 atau lebih baru
   ```bash
   node --version  # harus >= 18.0.0
   npm --version
   ```

2. **Git** (untuk clone repository)
   ```bash
   git --version
   ```

3. **Akun Neon PostgreSQL** (gratis)
   - Daftar di [https://neon.tech](https://neon.tech)

## 🚀 Step-by-Step Setup

### Step 1: Clone dan Install

```bash
# Clone repository
git clone <repository-url>
cd cashflow-app

# Install dependencies
npm install
```

**Troubleshooting:**
- Jika ada error saat install, coba hapus `node_modules` dan `package-lock.json`, lalu install ulang
- Pastikan koneksi internet stabil

### Step 2: Setup Neon PostgreSQL

1. **Buat Akun dan Login**
   - Buka [https://neon.tech](https://neon.tech)
   - Sign up dengan email atau GitHub
   - Verifikasi email Anda

2. **Buat Project Baru**
   - Klik "New Project"
   - Pilih region terdekat (Asia Pacific - Singapore recommended)
   - Beri nama project: `cashflow-app`
   - Klik "Create Project"

3. **Get Connection String**
   - Setelah project dibuat, Anda akan melihat connection details
   - Copy **Connection String** yang terlihat seperti:
     ```
     postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
     ```
   - Simpan connection string ini

### Step 3: Setup Environment Variables

1. **Copy file .env.example**
   ```bash
   cp .env.example .env
   ```

2. **Edit file .env**
   ```bash
   # Windows
   notepad .env
   
   # Mac/Linux
   nano .env
   # atau
   code .env
   ```

3. **Isi Environment Variables**
   ```env
   # Paste connection string dari Neon
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   
   # URL aplikasi (untuk development)
   NEXTAUTH_URL="http://localhost:3000"
   
   # Generate secret key (lihat cara di bawah)
   NEXTAUTH_SECRET="your-generated-secret-here"
   ```

4. **Generate NEXTAUTH_SECRET**
   
   **Option 1: Menggunakan OpenSSL (Recommended)**
   ```bash
   # Mac/Linux
   openssl rand -base64 32
   
   # Windows (PowerShell)
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   
   **Option 2: Online Generator**
   - Buka [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
   - Copy hasil generate
   - Paste ke `NEXTAUTH_SECRET` di file `.env`

### Step 4: Setup Database

1. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```
   
   Output yang diharapkan:
   ```
   ✔ Generated Prisma Client
   ```

2. **Push Schema ke Database**
   ```bash
   npm run prisma:push
   ```
   
   Output yang diharapkan:
   ```
   🚀  Your database is now in sync with your Prisma schema.
   ```

3. **Seed Database (Optional tapi Recommended)**
   ```bash
   npm run prisma:seed
   ```
   
   Output yang diharapkan:
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

**Troubleshooting:**
- **Error: P1001** - Database connection failed
  - Cek DATABASE_URL di .env
  - Pastikan Neon database aktif
  - Cek internet connection
  
- **Error: P3009** - Migration failed
  - Hapus database dan buat ulang di Neon
  - Jalankan `npm run prisma:push` lagi

### Step 5: Run Development Server

```bash
npm run dev
```

Output yang diharapkan:
```
  ▲ Next.js 16.3.3
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 2.5s
```

### Step 6: Test Aplikasi

1. **Buka Browser**
   - Navigasi ke [http://localhost:3000](http://localhost:3000)
   - Anda akan otomatis redirect ke `/login`

2. **Login dengan Demo User**
   ```
   Email: demo@example.com
   Password: password123
   ```

3. **Test Fitur**
   - Dashboard/Rekap: Lihat summary dan riwayat transaksi
   - Uang Masuk: Tambah, edit, hapus transaksi pemasukan
   - Uang Keluar: Tambah, edit, hapus transaksi pengeluaran
   - Logout: Klik tombol "Keluar" di sidebar

## 🔧 Perintah Berguna

```bash
# Development
npm run dev              # Run development server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Sync schema to database
npm run prisma:seed      # Seed demo data
npm run prisma:migrate   # Create and run migration

# Build & Production
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

## 🎯 Verifikasi Setup

Checklist untuk memastikan setup berhasil:

- [ ] `npm install` selesai tanpa error
- [ ] File `.env` sudah dibuat dan diisi
- [ ] `npm run prisma:generate` berhasil
- [ ] `npm run prisma:push` berhasil
- [ ] `npm run prisma:seed` berhasil (jika dijalankan)
- [ ] `npm run dev` berjalan di http://localhost:3000
- [ ] Bisa login dengan demo user
- [ ] Dashboard menampilkan data dengan benar
- [ ] Bisa menambah transaksi baru

## 🆘 Troubleshooting Common Issues

### 1. Error: Cannot find module '@prisma/client'

**Solusi:**
```bash
npm run prisma:generate
```

### 2. Error: Environment variable not found: DATABASE_URL

**Solusi:**
- Pastikan file `.env` ada di root folder
- Pastikan `DATABASE_URL` ada di `.env`
- Restart development server

### 3. Error: NextAuth configuration error

**Solusi:**
- Pastikan `NEXTAUTH_SECRET` sudah di-set di `.env`
- Generate secret baru jika perlu
- Restart development server

### 4. Error: Failed to connect to database

**Solusi:**
- Cek DATABASE_URL benar
- Pastikan Neon database aktif dan tidak sleep
- Test connection di Neon dashboard
- Pastikan `?sslmode=require` ada di connection string

### 5. Port 3000 already in use

**Solusi:**
```bash
# Kill process di port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain
PORT=3001 npm run dev
```

## 📚 Next Steps

Setelah setup berhasil:

1. **Buat User Sendiri**
   - Klik "Daftar di sini" di halaman login
   - Register dengan email dan password Anda

2. **Tambah Transaksi Real**
   - Mulai catat transaksi keuangan Anda
   - Test semua fitur CRUD

3. **Customize (Optional)**
   - Ubah warna di Tailwind
   - Tambah fitur sesuai kebutuhan
   - Modify database schema jika perlu

4. **Deploy ke Production**
   - Ikuti guide di README.md
   - Setup production database di Neon
   - Deploy ke Vercel atau platform lain

## 🤝 Need Help?

Jika mengalami kesulitan:

1. Baca TESTING.md untuk checklist lengkap
2. Cek error message dengan teliti
3. Google error message spesifik
4. Cek documentation:
   - Next.js: https://nextjs.org/docs
   - Prisma: https://www.prisma.io/docs
   - Neon: https://neon.tech/docs

## ✅ Setup Complete!

Selamat! Aplikasi Cashflow Simple Anda sudah siap digunakan. 🎉

Mulai catat transaksi keuangan Anda dan kelola cashflow dengan lebih baik!
