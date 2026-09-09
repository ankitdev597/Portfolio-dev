#!/usr/bin/env sh
set -e

# Every service (web/worker/reverb) on Render shares this one Docker image;
# APP_ROLE (set per-service in render.yaml) picks which process runs.
# Only the web process runs migrations, so a simultaneous deploy of all
# services never races on the schema.
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

    # All seeders in database/seeders/ are idempotent (updateOrCreate /
    # firstOrCreate keyed on slug/email/etc.), so it's safe to run this on
    # every boot rather than once by hand - a fresh deploy (new Postgres
    # instance, or the first deploy ever) ends up fully populated with no
    # extra manual step. AdminUserSeeder specifically no-ops (with a
    # warning, not a failure) unless ADMIN_SEED_PASSWORD is set in the
    # environment - see that seeder's own docblock. Never commit that
    # password's value to render.yaml; set it only via the Render
    # dashboard/API, same as APP_KEY should have been from the start.
    php artisan db:seed --force

    # Render's free plan has no "Background Worker" service type (see
    # render.yaml), so the queue worker runs in-process here alongside the
    # web server instead of as its own service. The while-loop restarts it
    # if it ever exits (e.g. --max-time recycling, or an uncaught error) -
    # there's no supervisor in this image, so this loop is the only thing
    # keeping it alive. Its stdout/stderr still land in this service's log
    # stream, interleaved with the web server's.
    (
        while true; do
            php artisan queue:work --tries=3 --sleep=3 --max-time=3600 || true
            sleep 5
        done
    ) &

    exec php artisan serve --host=0.0.0.0 --port="$PORT"
elif [ "$APP_ROLE" = "worker" ]; then
    # Kept for when/if this moves to a paid plan and the queue worker is
    # split back out into its own Background Worker service - not used by
    # the current render.yaml.
    exec php artisan queue:work --tries=3 --sleep=3 --max-time=3600
elif [ "$APP_ROLE" = "reverb" ]; then
    exec php artisan reverb:start --host=0.0.0.0 --port="$PORT"
else
    echo "Unknown APP_ROLE: $APP_ROLE (expected web, worker, or reverb)" >&2
    exit 1
fi
