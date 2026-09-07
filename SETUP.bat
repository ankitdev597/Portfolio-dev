@echo off
cd /d "%~dp0"

echo ============================================
echo Portfolio CRM - Setup ^& Run (one command)
echo ============================================
echo.

where composer >nul 2>nul
if errorlevel 1 (
    echo ERROR: "composer" was not found on PATH. Install Composer or add it to PATH, then re-run this script.
    pause
    exit /b 1
)

where php >nul 2>nul
if errorlevel 1 (
    echo ERROR: "php" was not found on PATH. Add your PHP folder ^(e.g. C:\xampp\php^) to PATH, then re-run this script.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: "npm" was not found on PATH. Install Node.js, then re-run this script.
    pause
    exit /b 1
)

echo [1/8] Making sure required storage folders exist...
if not exist "storage\framework\cache\data" mkdir "storage\framework\cache\data"
if not exist "storage\framework\sessions" mkdir "storage\framework\sessions"
if not exist "storage\framework\views" mkdir "storage\framework\views"
if not exist "storage\framework\testing" mkdir "storage\framework\testing"
if not exist "storage\app\public" mkdir "storage\app\public"
if not exist "storage\logs" mkdir "storage\logs"
if not exist "bootstrap\cache" mkdir "bootstrap\cache"

echo.
echo [2/8] Installing PHP dependencies ^(composer install^)...
call composer install --no-interaction
if errorlevel 1 (
    echo.
    echo COMPOSER INSTALL FAILED. See the errors above.
    pause
    exit /b 1
)

echo.
echo Refreshing cached package/service list ^(bootstrap\cache\packages.php,
echo services.php^) so it matches the vendor folder that was just installed -
echo a stale cache here is what causes "Class ... not found" errors for
echo packages that ARE actually installed...
call php artisan package:discover --ansi
call php artisan config:clear

echo.
echo [3/8] Preparing .env...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0generate-env.ps1"

echo.
echo [4/8] Generating application key ^(only if not already set^)...
findstr /r /c:"^APP_KEY=base64:" ".env" >nul 2>nul
if errorlevel 1 (
    call php artisan key:generate --ansi
) else (
    echo APP_KEY already set - leaving it as-is.
)

echo.
echo Creating the public storage symlink ^(needed for uploaded images -
echo project thumbnails, avatar photos - to be reachable as real URLs;
echo safe to re-run, Laravel just reports it already exists^)...
call php artisan storage:link

echo.
echo [5/8] Creating database "portfolio_crm" if it does not already exist...
php -r "try { $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', ''); $pdo->exec('CREATE DATABASE IF NOT EXISTS portfolio_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'); echo 'Database ready.'.PHP_EOL; } catch (Exception $e) { echo 'DB ERROR: '.$e->getMessage().PHP_EOL; echo 'Make sure MySQL is running in XAMPP Control Panel, then re-run this script.'.PHP_EOL; }"

echo.
echo [6/8] Running migrations (safe to re-run - only applies what's missing)...
call php artisan migrate --force
if errorlevel 1 (
    echo.
    echo MIGRATION FAILED. Check that MySQL is running in XAMPP Control Panel and the DB_* values in .env are correct.
    pause
    exit /b 1
)

echo.
echo [7/8] Seeding database ^(roles, admin user, site settings, resume-sourced content - safe to re-run^)...
call php artisan db:seed --force

echo.
echo [8/8] Installing frontend dependencies and building assets...
call npm install
if errorlevel 1 (
    echo.
    echo NPM INSTALL FAILED. See the errors above.
    pause
    exit /b 1
)
call npm run build

echo.
echo ============================================
echo Setup complete. Starting the servers now...
echo   Admin login:    http://127.0.0.1:8000/login
echo   Email:          developerankit597@gmail.com
echo   Temp password:  Portfolio@2026Dev  (change this after first login)
echo ============================================
echo.

call "%~dp0START_SERVERS.bat"
