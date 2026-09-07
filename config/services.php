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

];
