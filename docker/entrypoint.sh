#!/usr/bin/env sh
set -e

# Every service (web/worker/reverb) on Render shares this one Docker image;
# APP_ROLE (set per-service in render.yaml) picks which process runs.
# Only the web process runs migrations, so a simultaneous deploy of all
# three services never races on the schema.
APP_ROLE="${APP_ROLE:-web}"
PORT="${PORT:-10000}"

# Config is read from real env vars (Render injects these directly into the
# container), not a committed .env file - clear any stale cached config
# from a previous image layer before every boot.
php artisan config:clear

if [ "$APP_ROLE" = "web" ]; then
    # Safe to run on every boot: creates the storage->public symlink when
    # using the local disk, and is a no-op error we deliberately ignore
    # when PUBLIC_DISK_DRIVER=s3 (there's nothing local to link to).
    php artisan storage:link || true
    php artisan migrate --force
    exec php artisan serve --host=0.0.0.0 --port="$PORT"
elif [ "$APP_ROLE" = "worker" ]; then
    exec php artisan queue:work --tries=3 --sleep=3 --max-time=3600
elif [ "$APP_ROLE" = "reverb" ]; then
    exec php artisan reverb:start --host=0.0.0.0 --port="$PORT"
else
    echo "Unknown APP_ROLE: $APP_ROLE (expected web, worker, or reverb)" >&2
    exit 1
fi
