@echo off
echo ============================================
echo    CASHFLOW APP - COMPLETE PRISMA FIX
echo ============================================
echo.
echo This will:
echo 1. Uninstall problematic Prisma versions
echo 2. Install correct Prisma versions
echo 3. Generate Prisma Client
echo 4. Clean Next.js cache
echo.
pause
echo.

echo [1/6] Creating .env file if not exists...
if not exist ".env" (
    echo Creating .env file...
    (
        echo DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require"
        echo NEXTAUTH_URL="http://localhost:3000"
        echo NEXTAUTH_SECRET="development-secret-key-change-in-production"
    ) > .env
    echo .env file created with dummy values
) else (
    echo .env file already exists
)
echo.

echo [2/6] Cleaning cache folders...
if exist ".next" (
    rmdir /s /q .next
    echo .next deleted
)
if exist "node_modules\.prisma" (
    rmdir /s /q node_modules\.prisma
    echo .prisma deleted
)
echo.

echo [3/6] Uninstalling old Prisma versions...
call npm uninstall prisma @prisma/client
echo.

echo [4/6] Installing correct Prisma versions...
echo This may take a minute...
call npm install -D prisma@5.22.0
call npm install @prisma/client@5.22.0
echo.

echo [5/6] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ERROR: Prisma generate failed!
    echo.
    echo Try running manually:
    echo   1. npm install -D prisma@5.22.0
    echo   2. npm install @prisma/client@5.22.0
    echo   3. npx prisma generate
    echo.
    pause
    exit /b 1
)
echo.

echo [6/6] Verifying installation...
if exist "node_modules\.prisma\client" (
    echo.
    echo ============================================
    echo    SUCCESS! FIX COMPLETED!
    echo ============================================
    echo.
    echo Prisma Client has been generated successfully!
    echo.
    echo Next steps:
    echo   1. Run: npm run dev
    echo   2. Open: http://localhost:3000
    echo.
    echo Note: You're using dummy DATABASE_URL for now.
    echo To connect to real database, edit .env file
    echo and run: npx prisma db push
    echo.
) else (
    echo.
    echo WARNING: .prisma folder still not found!
    echo.
    echo Please try manual installation:
    echo   1. Delete node_modules folder
    echo   2. Delete package-lock.json
    echo   3. Run: npm install
    echo   4. Run: npx prisma generate
    echo   5. Run: npm run dev
    echo.
)

pause
