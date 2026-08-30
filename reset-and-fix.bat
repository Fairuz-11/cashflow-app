@echo off
echo =============================================
echo   CASHFLOW APP - FULL RESET AND FIX
echo =============================================
echo.
echo Script ini akan:
echo 1. Hapus .next cache
echo 2. Hapus .prisma client lama
echo 3. Generate ulang Prisma Client (MySQL)
echo 4. Selesai - siap npm run dev
echo.
echo PASTIKAN: npm run dev sudah di-stop dulu! (Ctrl+C)
echo.
pause

:: Step 1 - Hapus .next
echo.
echo [1/3] Menghapus .next cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo .next berhasil dihapus
) else (
    echo .next tidak ada
)

:: Step 2 - Hapus .prisma
echo.
echo [2/3] Menghapus Prisma Client lama...
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo .prisma berhasil dihapus
) else (
    echo .prisma tidak ada
)

:: Step 3 - Generate ulang
echo.
echo [3/3] Generate Prisma Client baru untuk MySQL...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo GAGAL! Coba jalankan manual:
    echo   npx prisma generate
    pause
    exit /b 1
)

echo.
echo =============================================
echo   SELESAI!
echo =============================================
echo.
echo Sekarang jalankan:
echo   1. npx prisma db push    (buat tabel di MySQL)
echo   2. npm run dev           (start aplikasi)
echo.
pause
