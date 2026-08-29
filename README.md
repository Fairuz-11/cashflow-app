# Cashflow Simple

Aplikasi pencatat cashflow sederhana dan modern yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Neon PostgreSQL.

## 🚀 Fitur

- ✅ **Autentikasi** - Login dan Register dengan NextAuth
- 📊 **Dashboard/Rekap** - Melihat ringkasan total pemasukan, pengeluaran, dan profit
- 💰 **Uang Masuk** - Kelola transaksi pemasukan dengan CRUD lengkap
- 💸 **Uang Keluar** - Kelola transaksi pengeluaran dengan CRUD lengkap
- 🎨 **UI Modern** - Desain minimalis dan responsif dengan Tailwind CSS
- ✔️ **Validasi** - Input validation menggunakan Zod
- 🔒 **Keamanan** - Password hashing dengan bcrypt

## 🛠️ Teknologi

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ dan npm
- Akun Neon PostgreSQL (gratis di [neon.tech](https://neon.tech))

## 🔧 Setup dan Instalasi

### ⚡ Quick Start (Fastest)

```bash
# 1. Install dependencies
npm install

# 2. Fix Prisma (run one of these):
fix-prisma.bat        # Windows Command Prompt
.\fix-prisma.ps1      # Windows PowerShell

# 3. Start development
npm run dev
```

**That's it!** Open http://localhost:3000

---

### 📖 Detailed Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd cashflow-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan kredensial Anda:

```env
# Database - Dapatkan dari Neon PostgreSQL Dashboard
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
```

**Cara mendapatkan DATABASE_URL:**
1. Buat akun di [neon.tech](https://neon.tech)
2. Buat project baru
3. Copy connection string dari dashboard
4. Paste ke `.env`

**Cara generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Atau gunakan generator online seperti [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

### 4. Setup Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Push schema ke database:
```bash
npm run prisma:push
```

Seed database dengan data contoh (opsional):
```bash
npm run prisma:seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 👤 Login Demo

Jika Anda menjalankan seed, gunakan kredensial berikut:

```
Email: demo@example.com
Password: password123
```

## 📁 Struktur Project

```
cashflow-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth & Register
│   │   ├── transactions/         # Transaction API
│   │   └── user/                 # User API
│   ├── dashboard/                # Dashboard/Rekap page
│   ├── income/                   # Uang Masuk page
│   ├── expense/                  # Uang Keluar page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   └── layout.tsx                # Root layout
├── components/                   # React Components
│   ├── dashboard/                # Dashboard components
│   ├── layout/                   # Layout components
│   ├── providers/                # Context providers
│   ├── transactions/             # Transaction components
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility libraries
│   ├── actions/                  # Server Actions
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client
│   └── session.ts                # Session helpers
├── prisma/                       # Prisma files
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
└── types/                        # TypeScript types

```

## 🗄️ Database Schema

### User
- id (String, Primary Key)
- name (String, Nullable)
- email (String, Unique)
- password (String)
- createdAt (DateTime)
- updatedAt (DateTime)

### Transaction
- id (String, Primary Key)
- type (Enum: income | expense)
- description (String)
- amount (Decimal)
- transactionDate (DateTime)
- userId (String, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)

## 📜 Available Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build production
- `npm run start` - Jalankan production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migration
- `npm run prisma:push` - Push schema ke database
- `npm run prisma:seed` - Seed database dengan data contoh

## 🎨 Halaman

### 1. Login & Register
- Form autentikasi dengan validasi
- Error handling
- Redirect otomatis setelah login

### 2. Dashboard/Rekap
- Card summary: Total Uang Masuk, Total Uang Keluar, Profit
- Riwayat 10 transaksi terbaru
- Navigasi sidebar

### 3. Uang Masuk
- Daftar semua transaksi pemasukan
- Tambah pemasukan baru
- Edit transaksi
- Hapus transaksi
- Total pemasukan

### 4. Uang Keluar
- Daftar semua transaksi pengeluaran
- Tambah pengeluaran baru
- Edit transaksi
- Hapus transaksi
- Total pengeluaran

## 🔐 Keamanan

- Password di-hash menggunakan bcryptjs
- Session management dengan NextAuth
- Protected routes dengan middleware
- Input validation dengan Zod
- SQL injection protection dengan Prisma

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🐛 Troubleshooting

### Error: "Cannot find module '.prisma/client/default'"

**Quick Fix:**
```bash
# Run the fix script
fix-prisma.bat    # or fix-prisma.ps1

# OR manually:
npx prisma generate
rmdir /s /q .next
npm run dev
```

See `FIX_PRISMA_ERROR.md` for detailed guide.

### Database Connection Error
- Pastikan DATABASE_URL sudah benar
- Cek apakah Neon database sudah aktif
- Pastikan SSL mode enabled (`?sslmode=require`)

### NextAuth Error
- Pastikan NEXTAUTH_SECRET sudah di-set
- Pastikan NEXTAUTH_URL sesuai dengan URL aplikasi

### Prisma Client Error
- Jalankan `npm run prisma:generate` ulang
- Restart development server

## 📝 License

MIT License

## 👨‍💻 Developer

Dibuat dengan ❤️ menggunakan Next.js dan Neon PostgreSQL
