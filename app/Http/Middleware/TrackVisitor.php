<?php

namespace App\Http\Middleware;

use App\Services\VisitorTrackingService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Thin dispatch shim - all tracking logic lives in VisitorTrackingService
 * (kept there, not here, so it stays unit-testable and reusable outside
 * the HTTP pipeline). Runs after the response is prepared, never blocks or
 * mutates it: a tracking failure must never break the public page.
 */
class TrackVisitor
{
    public function __construct(private readonly VisitorTrackingService $tracking)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        try {
            $this->tracking->track($request);
        } catch (\Throwable $e) {
            report($e);
        }

        return $response;
    }
}
