<?php

namespace App\Http\Middleware;

use App\Services\SiteSettingService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user?->only(['id', 'name', 'email']),
                'roles' => $user?->getRoleNames() ?? [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'site' => fn () => app(SiteSettingService::class)->publicSettings(),
            // NOTE: the Composer package is still named `tightenco/ziggy`,
            // but its PHP namespace was renamed from `Tightenco\Ziggy` to
            // `Tighten\Ziggy` (dropped the "co") starting in the v2 line -
            // the version pulled by "tightenco/ziggy": "^2.4" in
            // composer.json uses the new namespace. Using the old one here
            // compiles fine (this file has no class-exists check) but
            // throws "Class not found" at request time.
            'ziggy' => fn () => [
                ...(new \Tighten\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
