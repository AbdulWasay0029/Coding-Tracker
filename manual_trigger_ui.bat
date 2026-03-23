@echo off
echo CodeSync - Manual Trigger
echo ==========================
cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo [CodeSync] First time setup detected! Installing dependencies...
    echo [CodeSync] This may take a minute...
    call npm install
    echo.
)

echo.
echo Select date range:
echo   1. Today (IST)
echo   2. Yesterday (IST)
echo   3. Custom date (YYYY-MM-DD)
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    cmd /k "npx tsx scripts/quick-check.ts"
) else if "%choice%"=="2" (
    cmd /k "npx tsx scripts/quick-check.ts yesterday"
) else if "%choice%"=="3" (
    set /p custom="Enter date (YYYY-MM-DD): "
    cmd /k "npx tsx scripts/quick-check.ts %custom%"
) else (
    echo Invalid choice.
    pause
)
