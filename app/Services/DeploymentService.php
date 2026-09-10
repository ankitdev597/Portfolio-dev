<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;

/**
 * Runs deploy-time database maintenance (migrate + seed) on demand, via a
 * single authenticated HTTP call (see
 * App\Http\Controllers\System\DeployHookController) instead of at container
 * startup.
 *
 * This exists specifically for the Vercel deployment target: Vercel's own
 * guidance warns against running `artisan migrate` from a container's
 * startup command, because multiple cold-start instances can boot
 * concurrently and race each other into running the same migration at the
 * same time. Render's container is a single long-lived VM (see
 * docker/entrypoint.sh), so it never had that problem and keeps migrating
 * on every boot - this service is Vercel-only tooling, not a replacement
 * for that.
 */
class DeploymentService
{
    /**
     * @return array{migrate: string, seed: string}
     */
    public function runMigrationsAndSeed(): array
    {
        Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = Artisan::output();

        Artisan::call('db:seed', ['--force' => true]);
        $seedOutput = Artisan::output();

        return [
            'migrate' => trim($migrateOutput),
            'seed' => trim($seedOutput),
        ];
    }
}
