@echo off
echo CodeSync - Quick Check (Today)
echo ================================
cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo [CodeSync] First time setup detected! Installing dependencies...
    echo [CodeSync] This may take a minute...
    call npm install
    echo.
)

call npx tsx scripts/quick-check.ts

echo.
pause
