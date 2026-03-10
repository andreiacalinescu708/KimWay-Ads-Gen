@echo off
echo ==========================================
echo  KIMIWAY ADS - SETUP
echo ==========================================
echo.

REM Verifică dacă Node.js este instalat
node --version >nul 2>&1
if errorlevel 1 (
    echo [EROARE] Node.js nu este instalat!
    echo Descarcă de la: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js este instalat
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

REM Rulează migrările
echo [3/4] Se rulează migrările bazei de date...
echo ATENȚIE: Asigură-te că PostgreSQL rulează și .env.local este configurat!
echo.
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo [EROARE] Migrările au eșuat. Verifică DATABASE_URL în .env.local
    pause
    exit /b 1
)
echo [OK] Migrări aplicate
echo.

REM Seed baza de date
echo [4/4] Se populează baza de date cu date inițiale...
call npx tsx prisma/seed.ts
if errorlevel 1 (
    echo [AVERTISMENT] Seed-ul a eșuat, dar poți continua
)
echo [OK] Baza de date populată
echo.

echo ==========================================
echo  SETUP COMPLET! ✅
echo ==========================================
echo.
echo Pentru a porni aplicația:
echo   npm run dev
echo.
echo Apoi deschide: http://localhost:3000
echo.
pause
