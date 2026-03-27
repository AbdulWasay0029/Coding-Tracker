@echo off
title CodeSync
cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo.
    echo   First time? Installing dependencies...
    echo   This takes ~30 seconds. Hang tight!
    echo.
    call npm install >nul 2>&1
    echo   Done!
    echo.
)

:: Pass all arguments through (e.g., "yesterday", "2026-03-25")
call npx tsx scripts/quick-check.ts %*

echo.
pause
