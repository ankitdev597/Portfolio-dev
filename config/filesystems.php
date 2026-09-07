<?php

return [

    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        /**
         * Driver is env-switchable (PUBLIC_DISK_DRIVER) rather than a fixed
         * 'local' - added for the Render deployment. Render's free web
         * service has NO persistent disk, so every uploaded avatar/resume/
         * thumbnail/badge written to local storage is lost on the next
         * deploy or restart. Setting PUBLIC_DISK_DRIVER=s3 (plus the AWS_*
         * vars below, which work with any S3-compatible provider - e.g.
         * Cloudflare R2's free tier - not just AWS) points this same
         * 'public' disk name at object storage instead, with zero changes
         * needed anywhere else in the app (every Service class references
         * the disk as 'public'/self::DISK, never 's3' directly). Local dev
         * (XAMPP) leaves PUBLIC_DISK_DRIVER unset and keeps using local
         * disk exactly as before.
         */
        'public' => [
            'driver' => env('PUBLIC_DISK_DRIVER', 'local'),
            'root' => storage_path('app/public'),
            'url' => env('AWS_URL', env('APP_URL').'/storage'),
            'visibility' => 'public',
            'throw' => false,
            // Only read when driver is 's3' above - harmless no-ops otherwise.
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
        ],

    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
