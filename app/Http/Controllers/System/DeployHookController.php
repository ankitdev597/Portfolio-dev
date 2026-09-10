<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Services\DeploymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as HttpStatus;

/**
 * Deploy-time migrate+seed trigger, built for the Vercel target (see
 * VERCEL_DEPLOY.md). Deliberately NOT gated behind the app's own
 * session/Policy auth: there is no logged-in user at deploy time, and this
 * has to be callable from outside the app entirely (a shell one-liner you
 * run by hand after each deploy, or a CI step) before any session exists.
 *
 * Authenticated instead by a single shared-secret bearer token
 * (DEPLOY_HOOK_SECRET, see config/services.php), compared with
 * hash_equals() to avoid a timing side-channel. Leaving DEPLOY_HOOK_SECRET
 * unset makes the endpoint 404 unconditionally, so it's inert everywhere
 * (including the existing Render deployment) unless deliberately
 * configured for this one target.
 *
 * Call this once after any deploy that changes the schema - not on every
 * request/boot. See App\Services\DeploymentService's docblock for why
 * boot-time migration is unsafe on Vercel specifically.
 */
class DeployHookController extends Controller
{
    public function __invoke(Request $request, DeploymentService $deployments): JsonResponse
    {
        $secret = config('services.deploy_hook.secret');

        if (! $secret) {
            abort(HttpStatus::HTTP_NOT_FOUND);
        }

        if (! hash_equals((string) $secret, (string) $request->bearerToken())) {
            abort(HttpStatus::HTTP_FORBIDDEN);
        }

        return response()->json([
            'ok' => true,
            ...$deployments->runMigrationsAndSeed(),
        ]);
    }
}
