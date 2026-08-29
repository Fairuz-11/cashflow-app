# Testing & Verification Guide

## 🧪 Checklist Testing

### Setup & Installation
- [ ] Clone repository berhasil
- [ ] `npm install` berjalan tanpa error
- [ ] File `.env` sudah dibuat dan diisi dengan benar
- [ ] `npm run prisma:generate` berhasil
- [ ] `npm run prisma:push` berhasil (database schema sync)
- [ ] `npm run prisma:seed` berhasil (data demo tercreate)
- [ ] `npm run dev` berjalan di port 3000

### 1. Autentikasi

#### Register
- [ ] Buka `/register`
- [ ] Form register tampil dengan field: Nama, Email, Password, Konfirmasi Password
- [ ] Error validation muncul jika:
  - Field kosong
  - Email tidak valid
  - Password kurang dari 6 karakter
  - Password tidak cocok
  - Email sudah terdaftar
- [ ] Register berhasil redirect ke `/login`

#### Login
- [ ] Buka `/login`
- [ ] Form login tampil dengan field: Email, Password
- [ ] Login dengan kredensial yang salah menampilkan error
- [ ] Login dengan kredensial demo:
  - Email: `demo@example.com`
  - Password: `password123`
- [ ] Login berhasil redirect ke `/dashboard`
- [ ] Akses `/dashboard` tanpa login redirect ke `/login`

#### Logout
- [ ] Klik tombol "Keluar" di sidebar
- [ ] User ter-logout dan redirect ke `/login`

### 2. Dashboard/Rekap

#### Summary Cards
- [ ] Card "Total Uang Masuk" menampilkan total income (warna hijau)
- [ ] Card "Total Uang Keluar" menampilkan total expense (warna merah)
- [ ] Card "Profit" menampilkan selisih income - expense
- [ ] Profit positif berwarna biru, negatif berwarna merah
- [ ] Angka terformat dengan Rupiah (Rp)

#### Riwayat Transaksi
- [ ] Menampilkan 10 transaksi terbaru
- [ ] Transaksi diurutkan dari tanggal terbaru
- [ ] Setiap transaksi menampilkan:
  - Icon (+ untuk income, - untuk expense)
  - Keterangan
  - Tanggal (format: DD MMM YYYY)
  - Nominal dengan prefix +/- dan warna sesuai type
  - Label "Pemasukan" atau "Pengeluaran"
- [ ] Jika belum ada transaksi, tampil empty state

#### Sidebar
- [ ] Logo "Cashflow" tampil
- [ ] User info tampil (initial & nama)
- [ ] Menu navigasi:
  - Rekap (active)
  - Uang Masuk
  - Uang Keluar
- [ ] Menu active ditandai dengan background biru
- [ ] Tombol "Keluar" di bawah

### 3. Uang Masuk

#### Daftar Transaksi
- [ ] Buka `/income`
- [ ] Header "Uang Masuk" tampil
- [ ] Tombol "Tambah Pemasukan" tampil
- [ ] Card total pemasukan tampil dengan warna hijau
- [ ] Tabel transaksi menampilkan:
  - Tanggal
  - Keterangan
  - Jenis (badge "Pemasukan" hijau)
  - Nominal (format Rupiah)
  - Aksi (Edit & Hapus)
- [ ] Hanya menampilkan transaksi dengan type "income"
- [ ] Jika belum ada transaksi, tampil empty state

#### Tambah Pemasukan
- [ ] Klik tombol "Tambah Pemasukan"
- [ ] Modal form terbuka dengan judul "Tambah Pemasukan"
- [ ] Form memiliki field:
  - Tanggal (default: hari ini)
  - Keterangan (required)
  - Nominal (required, number, min: 0)
- [ ] Validasi error jika:
  - Keterangan kosong
  - Nominal <= 0
  - Tanggal tidak valid
- [ ] Klik "Batal" menutup modal
- [ ] Klik "Simpan" dengan data valid:
  - Transaksi tersimpan ke database
  - Modal tertutup
  - Daftar transaksi ter-refresh
  - Total pemasukan ter-update
  - Dashboard ter-update

#### Edit Pemasukan
- [ ] Klik tombol "Edit" pada transaksi
- [ ] Modal form terbuka dengan judul "Edit Pemasukan"
- [ ] Form terisi dengan data transaksi yang dipilih
- [ ] Ubah data dan klik "Simpan"
- [ ] Transaksi ter-update di database
- [ ] Daftar transaksi ter-refresh

#### Hapus Pemasukan
- [ ] Klik tombol "Hapus" pada transaksi
- [ ] Muncul konfirmasi dialog
- [ ] Klik "OK" untuk konfirmasi
- [ ] Transaksi terhapus dari database
- [ ] Daftar transaksi ter-refresh
- [ ] Total pemasukan ter-update

### 4. Uang Keluar

#### Daftar Transaksi
- [ ] Buka `/expense`
- [ ] Header "Uang Keluar" tampil
- [ ] Tombol "Tambah Pengeluaran" tampil
- [ ] Card total pengeluaran tampil dengan warna merah
- [ ] Tabel transaksi menampilkan:
  - Tanggal
  - Keterangan
  - Jenis (badge "Pengeluaran" merah)
  - Nominal (format Rupiah)
  - Aksi (Edit & Hapus)
- [ ] Hanya menampilkan transaksi dengan type "expense"
- [ ] Jika belum ada transaksi, tampil empty state

#### Tambah Pengeluaran
- [ ] Klik tombol "Tambah Pengeluaran"
- [ ] Modal form terbuka dengan judul "Tambah Pengeluaran"
- [ ] Form memiliki field yang sama seperti Uang Masuk
- [ ] Validasi sama dengan Uang Masuk
- [ ] Simpan berhasil, transaksi tersimpan dengan type "expense"

#### Edit Pengeluaran
- [ ] Fungsi edit sama dengan Uang Masuk
- [ ] Modal judul "Edit Pengeluaran"

#### Hapus Pengeluaran
- [ ] Fungsi hapus sama dengan Uang Masuk

### 5. Responsive Design

#### Desktop (1024px+)
- [ ] Sidebar tampil di kiri dengan lebar 256px
- [ ] Content area menggunakan sisa lebar
- [ ] Cards dalam grid 3 kolom di dashboard
- [ ] Tabel tampil dengan baik

#### Tablet (768px - 1023px)
- [ ] Sidebar tetap tampil
- [ ] Cards dalam grid 2-3 kolom
- [ ] Tabel scrollable horizontal jika perlu

#### Mobile (<768px)
- [ ] Sidebar collapse atau overlay
- [ ] Cards dalam grid 1 kolom
- [ ] Tabel scrollable horizontal
- [ ] Tombol dan input full width

### 6. Data Integrity

#### Perhitungan
- [ ] Total Uang Masuk = SUM(transaksi dengan type "income")
- [ ] Total Uang Keluar = SUM(transaksi dengan type "expense")
- [ ] Profit = Total Uang Masuk - Total Uang Keluar
- [ ] Angka selalu akurat setelah CRUD

#### Database
- [ ] Setiap transaksi memiliki userId
- [ ] User hanya bisa melihat transaksi miliknya sendiri
- [ ] Delete cascade berfungsi (hapus user, transaksinya ikut terhapus)

### 7. Error Handling

- [ ] Error koneksi database ditangani dengan graceful
- [ ] Form validation menampilkan pesan error yang jelas
- [ ] API error menampilkan pesan yang user-friendly
- [ ] Loading state tampil saat fetch data
- [ ] Empty state tampil saat data kosong

### 8. Security

- [ ] Password tidak tampil di frontend
- [ ] Password di-hash di database (bcrypt)
- [ ] Protected routes memerlukan autentikasi
- [ ] Session management berfungsi dengan baik
- [ ] SQL injection protected (menggunakan Prisma)

## 🐛 Known Issues & Limitations

1. **Sidebar Mobile**: Perlu implementasi mobile menu (hamburger)
2. **Date Picker**: Menggunakan native HTML date input
3. **Currency Input**: Belum ada thousand separator saat input
4. **Pagination**: Belum ada pagination untuk daftar transaksi
5. **Search & Filter**: Belum ada fitur search dan filter
6. **Export**: Belum ada fitur export ke Excel/PDF

## ✅ Verification Results

Setelah melakukan testing, pastikan:

1. ✅ Semua fitur CRUD berfungsi
2. ✅ Autentikasi berjalan dengan aman
3. ✅ Perhitungan akurat
4. ✅ UI responsif
5. ✅ Error handling proper
6. ✅ Database connection stabil

## 🚀 Production Readiness

Sebelum deploy ke production:

- [ ] Setup production database di Neon
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Update NEXTAUTH_URL ke domain production
- [ ] Run `npm run build` untuk memastikan build sukses
- [ ] Test di production environment
- [ ] Setup monitoring & logging
- [ ] Backup strategy untuk database

## 📝 Notes

- Testing dilakukan dengan data seed demo
- Untuk testing production, gunakan real data
- Lakukan regression testing setiap ada perubahan kode
