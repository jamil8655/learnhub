<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Firebase Credentials & Project Configuration
    |--------------------------------------------------------------------------
    |
    | Path to your Firebase service account JSON credentials file, or raw JSON string.
    | NEVER hardcode credentials or private keys in source code.
    |
    */

    'credentials' => env('FIREBASE_CREDENTIALS', env('GOOGLE_APPLICATION_CREDENTIALS')),

    'credentials_json' => env('FIREBASE_CREDENTIALS_JSON'),

    'project_id' => env('FIREBASE_PROJECT_ID', 'studio-5305763939-bdcf7'),

    /*
    |--------------------------------------------------------------------------
    | Custom Claims Configuration
    |--------------------------------------------------------------------------
    |
    | Define default claims and privilege structures for LearnHub Admin ecosystem.
    |
    */

    'claims' => [
        'admin_role' => 'admin',
        'super_admin_role' => 'super_admin',
        'default_role' => 'student',
    ],

    /*
    |--------------------------------------------------------------------------
    | Firebase Services Enablement
    |--------------------------------------------------------------------------
    */

    'auth' => [
        'enabled' => env('FIREBASE_AUTH_ENABLED', true),
    ],

    'firestore' => [
        'enabled' => env('FIREBASE_FIRESTORE_ENABLED', true),
    ],

    'database_url' => env('FIREBASE_DATABASE_URL', null),

    'storage_bucket' => env('FIREBASE_STORAGE_BUCKET', null),

];
