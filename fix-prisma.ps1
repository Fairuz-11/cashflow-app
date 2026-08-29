# Cashflow App - Fix Prisma Client Error
# PowerShell Script

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   CASHFLOW APP - FIX PRISMA CLIENT ERROR" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check .env file
Write-Host "[1/5] Checking .env file..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found! Creating..." -ForegroundColor Red
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    }
    
    # Add dummy values
    @"
DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "Created .env with dummy values" -ForegroundColor Green
    Write-Host "IMPORTANT: Edit .env and add your real DATABASE_URL" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ".env file exists" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Clean Next.js cache
Write-Host "[2/5] Cleaning Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host ".next folder deleted" -ForegroundColor Green
} else {
    Write-Host ".next folder not found, skipping..." -ForegroundColor Gray
}
Write-Host ""

# Step 3: Check Prisma installation
Write-Host "[3/5] Checking Prisma installation..." -ForegroundColor Yellow
$prismaInstalled = npm list @prisma/client 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing @prisma/client..." -ForegroundColor Yellow
    npm install @prisma/client
    Write-Host ""
} else {
    Write-Host "@prisma/client is installed" -ForegroundColor Green
    Write-Host ""
}

# Step 4: Generate Prisma Client
Write-Host "[4/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "Prisma Client generated successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Prisma generate failed!" -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL in .env file" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 5: Verify generation
Write-Host "[5/5] Verifying generation..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client") {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "   SUCCESS! FIX COMPLETED!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prisma Client folder exists at: node_modules\.prisma\client" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: .prisma folder not found after generation" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running these commands manually:" -ForegroundColor Yellow
    Write-Host "  1. npm install" -ForegroundColor White
    Write-Host "  2. npx prisma generate" -ForegroundColor White
    Write-Host "  3. npm run dev" -ForegroundColor White
    Write-Host ""
}

Read-Host "Press Enter to exit"
