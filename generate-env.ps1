# Writes the initial .env for local development (XAMPP MySQL defaults:
# root / no password). Only runs when .env doesn't already exist, so it
# never clobbers values you've since changed. This file's content is
# identical to what was shown to you in chat - nothing hidden.

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host ".env already exists - leaving it as-is."
    exit 0
}

$envContent = @'
APP_NAME="Ankit Vishwakarma | Portfolio"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=Asia/Calcutta
APP_URL=http://127.0.0.1:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# --- Database (MySQL via XAMPP defaults: root / no password) ---
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_crm
DB_USERNAME=root
DB_PASSWORD=

# Kept on file/sync for this first run so the app doesn't hard-depend on a
# Redis connection being reachable yet. Switch these three back to `redis`
# once you've confirmed Redis is reachable from this machine - nothing
# else in the code needs to change.
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync

CACHE_STORE=file
CACHE_PREFIX=portfolio_crm_cache

# --- Redis (not required for this first run - see SESSION/CACHE/QUEUE above) ---
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# --- Mail (logs to storage/logs/laravel.log until you set real SMTP/SES) ---
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@ankitvishwakarma.dev"
MAIL_FROM_NAME="${APP_NAME}"
MAIL_ADMIN_ADDRESS="developerankit597@gmail.com"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

# --- Laravel Reverb (not started for this first run - see README) ---
REVERB_APP_ID=portfolio-crm
REVERB_APP_KEY=portfolio-crm-key
REVERB_APP_SECRET=portfolio-crm-secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

# --- Admin seed user ---
# TEMPORARY dev password so the very first run has something to log in
# with. Change it from /admin/account (or re-seed with a new value) right
# after your first successful login.
ADMIN_SEED_NAME="Ankit Vishwakarma"
ADMIN_SEED_EMAIL="developerankit597@gmail.com"
ADMIN_SEED_PASSWORD="Portfolio@2026Dev"
'@

Set-Content -Path $envPath -Value $envContent -NoNewline
Write-Host ".env created."
