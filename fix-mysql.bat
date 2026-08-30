@echo off
echo ============================================
echo    CASHFLOW APP - SETUP MYSQL
echo ============================================
echo.

echo Langkah yang akan dilakukan:
echo 1. Hapus Prisma Client lama
echo 2. Generate ulang Prisma Client untuk MySQL
echo 3. Push schema ke MySQL
echo 4. Bersihkan Next.js cache
echo.
echo PASTIKAN sebelum lanjut:
echo - MySQL sudah jalan (XAMPP ^> Start MySQL)
echo - Database cashflow_db sudah dibuat
echo - .env sudah diisi DATABASE_URL yang benar
echo.
pause

echo.
echo [1/4] Menghapus Prisma Client lama...
if exist "node_modules\.prisma" (
    rmdir /s /q node_modules\.prisma
    echo .prisma dihapus
) else (
    echo .prisma tidak ada, skip
)
echo.

echo [2/4] Generate Prisma Client baru (MySQL)...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ERROR: prisma generate gagal!
    echo Cek apakah prisma terinstall: npm install -D prisma@5.22.0
    pause
    exit /b 1
)
echo.

echo [3/4] Push schema ke MySQL...
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ERROR: db push gagal!
    echo.
    echo Kemungkinan penyebab:
    echo - MySQL belum jalan
    echo - Database cashflow_db belum dibuat
    echo - Password MySQL salah di .env
    echo.
    echo Coba buka phpMyAdmin dan buat database cashflow_db
    echo lalu jalankan script ini lagi
    pause
    exit /b 1
)
echo.

echo [4/4] Bersihkan Next.js cache...
if exist ".next" (
    rmdir /s /q .next
    echo .next dihapus
)
echo.

echo ============================================
echo    SELESAI! Jalankan: npm run dev
echo ============================================
echo.
pause
