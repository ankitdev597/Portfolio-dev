# syntax=docker/dockerfile:1

###############################################################################
# Stage 1: build frontend assets (Vite -> public/build)
###############################################################################
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Non-secret, public-by-nature values (the browser opens a websocket
# directly to these, so there's nothing to protect) baked into the JS
# bundle at build time. See .env.production for details.
COPY .env.production .env
RUN npm run build

###############################################################################
# Stage 2: install PHP dependencies
###############################################################################
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.jso[n] composer.loc[k] ./
# No composer.lock is committed yet (see README/deploy notes) - this
# resolves fresh against composer.json. Once you run `composer update`
# locally (XAMPP has real Composer/Packagist access) and commit the
# resulting composer.lock, this becomes a reproducible, pinned install.
RUN composer install --no-dev --no-scripts --no-autoloader --ignore-platform-reqs --optimize-autoloader

COPY . .
RUN composer dump-autoload --optimize --no-dev

###############################################################################
# Stage 3: runtime image
###############################################################################
FROM php:8.3-cli-bookworm AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev libzip-dev libpng-dev libonig-dev libicu-dev unzip git \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql pgsql mbstring zip gd bcmath intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=vendor /app /app
COPY --from=frontend /app/public/build /app/public/build

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p storage/framework/{cache,sessions,testing,views} storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["entrypoint.sh"]
