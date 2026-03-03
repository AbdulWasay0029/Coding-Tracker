@echo off
echo CodeSync - Quick Check (Today)
echo ================================
cd /d "%~dp0"
npx tsx scripts/quick-check.ts
