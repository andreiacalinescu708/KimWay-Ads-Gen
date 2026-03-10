@echo off
echo ==========================================
echo  KIMIWAY ADS - SETUP CU RAILWAY
echo ==========================================
echo.
echo Acest script configureaza aplicatia cu Railway PostgreSQL
echo.

REM Verifică Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [EROARE] Node.js nu este instalat!
    echo Descarcă de la: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detectat
echo.

REM Verifică dacă există .env.local
if not exist ".env.local" (
    echo [INFO] Fișier .env.local nu există încă
echo.
    echo Trebuie să configurezi .env.local mai întâi!
    echo.
    echo Pași:
    echo 1. Copiază .env.local.railway în .env.local
    echo 2. Adaugă DATABASE_URL de la Railway
    echo 3. Adaugă KIMI_API_KEY și RUNWAY_API_KEY
    echo.
    echo Apoi rulează din nou acest script.
    echo.
    pause
    exit /b 1
)

echo [OK] .env.local există
echo.

REM Instalează dependențele
echo [1/4] Se instalează dependențele...
call npm install
if errorlevel 1 (
    echo [EROARE] Nu s-au putut instala dependențele
    pause
    exit /b 1
)
echo [OK] Dependențe instalate
echo.

REM Generează Prisma client
echo [2/4] Se generează Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo [EROARE] Nu s-a putut genera Prisma client
    pause
    exit /b 1
)
echo [OK] Prisma client generat
echo.

REM Testează conexiunea la DB
echo [3/4] Se testează conexiunea la Railway DB...
call npx prisma db execute --stdin < nul >nul 2>&1
if errorlevel 1 (
    echo.
    echo [EROARE] Nu mă pot conecta la baza de date Railway!
    echo.
    echo Verifică:
    echo - DATABASE_URL este corect în .env.local?
    echo - Baza de date rulează în Railway Dashboard?
    echo - Ai copiat URL-ul complet din tab-ul "Connect"?
    echo.
    pause
    exit /b 1
)
echo [OK] Conexiune la Railway DB reușită
echo.

REM Rulează migrările
echo [4/4] Se aplică migrările în baza de date...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo [EROARE] Migrările au eșuat
    pause
    exit /b 1
)
echo [OK] Migrări aplicate
echo.

REM Seed
echo [5/5] Se populează baza de date...
call npx tsx prisma/seed.ts
echo [OK] Date inițiale adăugate
echo.

echo ==========================================
echo  ✅ SETUP COMPLET!
echo ==========================================
echo.
echo Pentru a porni:
echo   npm run dev
echo.
echo Pentru a testa API-urile:
echo   node test-apis.mjs
echo.
pause
