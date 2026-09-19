@echo off
echo ================================================================
echo   INSTALLING PORTFOLIO BACKEND & ADMIN DEPENDENCIES
echo ================================================================
echo.

echo [1/3] Installing Server Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo ✓ Server dependencies installed
echo.

cd ..

echo [2/3] Installing Admin Panel Dependencies...
cd admin
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install admin dependencies
    pause
    exit /b 1
)
echo ✓ Admin dependencies installed
echo.

cd ..

echo [3/3] Creating .env file...
cd server
if not exist .env (
    copy .env.example .env
    echo ✓ Created .env file
) else (
    echo .env file already exists
)
echo.

cd ..

echo ================================================================
echo   ✅ INSTALLATION COMPLETE!
echo ================================================================
echo.
echo Next steps:
echo 1. Edit server\.env and add your MongoDB URI
echo 2. Run: cd server ^&^& npm run dev
echo 3. Create admin account (see README.md)
echo 4. Run: cd admin ^&^& npm run dev
echo.
echo For detailed instructions, see START_HERE.txt
echo.
pause

