<?php

return [

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    // Approximate geolocation for the CRM visitor dashboard (country/region
    // level only - never precise coordinates). Swap the driver here without
    // touching application code (see App\Services\Analytics\GeoLocationService).
    'geoip' => [
        'driver' => env('GEOIP_DRIVER', 'null'),
        'maxmind_database_path' => env('GEOIP_MAXMIND_DB_PATH'),
    ],

    // Shared-secret bearer token for POST /system/deploy-hook (see
    // App\Http\Controllers\System\DeployHookController and
    // App\Services\DeploymentService). Unset in an environment => the
    // endpoint 404s unconditionally, so it's inert unless deliberately
    // configured. Only ever set via the hosting platform's own env var
    // dashboard, never committed - see VERCEL_DEPLOY.md.
    'deploy_hook' => [
        'secret' => env('DEPLOY_HOOK_SECRET'),
    ],

];
