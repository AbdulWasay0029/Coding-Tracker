@echo off
echo Triggering Daily Progress Update...
call npx tsx scripts/manual-trigger.ts
echo.
echo Update Complete.
pause
