@echo off
REM Military Asset Management System - Complete Setup Script (Windows)

echo.
echo Military Asset Management System - Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: PostgreSQL might not be in PATH. Make sure it's installed.
)

echo Setup OK
echo.

REM Backend Setup
echo Setting up Backend...
cd backend
call npm install
copy .env.example .env
echo Please edit backend\.env with your PostgreSQL credentials
echo.
cd ..

REM Frontend Setup
echo Setting up Frontend...
cd frontend
call npm install
copy .env.example .env
echo.
cd ..

echo Setup Complete!
echo.
echo Next Steps:
echo   1. Edit backend\.env with PostgreSQL credentials
echo   2. cd backend ^&^& npm run migrate
echo   3. npm run seed
echo   4. npm run dev
echo.
echo   5. In another terminal: cd frontend ^&^& npm run dev
echo   6. Open http://localhost:5173
echo.
echo Demo Credentials:
echo   Admin: admin@military.com / Admin@123
echo   Commander: commander@military.com / Commander@123
echo   Logistics: logistics@military.com / Logistics@123
echo.
pause
