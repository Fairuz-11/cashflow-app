@echo off
echo ============================================
echo    CASHFLOW APP - FIX PRISMA CLIENT ERROR
echo ============================================
echo.

echo [1/5] Checking .env file...
if not exist ".env" (
    echo WARNING: .env file not found! Creating from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and add your DATABASE_URL
    echo For now, using dummy DATABASE_URL...
    echo DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require" >> .env
    echo NEXTAUTH_URL="http://localhost:3000" >> .env
    echo NEXTAUTH_SECRET="development-secret-key-change-in-production" >> .env
    echo.
)

echo [2/5] Cleaning Next.js cache...
if exist ".next" (
    rmdir /s /q .next
    echo .next folder deleted
) else (
    echo .next folder not found, skipping...
)
echo.

echo [3/5] Checking Prisma installation...
echo Reinstalling Prisma with correct version...
call npm uninstall prisma @prisma/client
call npm install -D prisma@5.22.0
call npm install @prisma/client@5.22.0
echo.

echo [4/5] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ERROR: Prisma generate failed!
    echo Please check your DATABASE_URL in .env file
    echo.
    pause
    exit /b 1
)
echo.

echo [5/5] Verifying generation...
if exist "node_modules\.prisma\client" (
    echo SUCCESS! Prisma Client generated successfully!
    echo.
    echo ============================================
    echo    FIX COMPLETED!
    echo ============================================
    echo.
    echo You can now run: npm run dev
    echo.
) else (
    echo ERROR: .prisma folder not found after generation
    echo.
    echo Try running these commands manually:
    echo   1. npm install
    echo   2. npx prisma generate
    echo   3. npm run dev
    echo.
)

pause
