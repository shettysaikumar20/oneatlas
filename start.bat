@echo off
setlocal
title OneAtlas - AI Model Intelligence Platform

echo ===================================================
echo             OneAtlas Development Server
echo ===================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in PATH.
    echo Please install Node.js 18+ or 20+ to run OneAtlas.
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules" (
    echo [INFO] Installing project dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found. Copying from .env.example...
    copy .env.example .env
    echo Please configure DATABASE_URL in your .env file.
)

:: Generate Prisma client
echo [INFO] Generating Prisma Client...
call npx prisma generate

:: Start the Next.js development server
echo.
echo [INFO] Starting Next.js Dev Server on http://localhost:3000...
echo.
call npm run dev

pause
