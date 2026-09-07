@echo off
cd /d "%~dp0"

echo Starting the Laravel backend and the Vite dev server in separate windows...
start "Portfolio CRM - Laravel Backend" cmd /k "php artisan serve"
start "Portfolio CRM - Vite Dev Server" cmd /k "npm run dev"

echo.
echo Backend:   http://127.0.0.1:8000
echo Admin:     http://127.0.0.1:8000/login
echo.
echo Two new windows just opened - leave them running. Close this one if you like.
pause
