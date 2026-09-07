<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\SeoSettingData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SeoSettingRequest;
use App\Models\SeoSetting;
use App\Services\SeoSettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Per-page SEO overrides (title/description/canonical/og:image/keywords),
 * keyed by page_key (home, projects_index, ...). Small, bounded list -
 * modal-based CRUD like batches 1/3/4, Super-Admin-only per
 * SiteSettingPolicy (bound to SeoSetting in AppServiceProvider already).
 */
class SeoSettingController extends Controller
{
    public function __construct(private readonly SeoSettingService $seoSettings) {}

    public function index(): Response
    {
        $this->authorize('viewAny', SeoSetting::class);

        return Inertia::render('Admin/SeoSettings/Index', [
            'seoSettings' => SeoSetting::query()->orderBy('page_key')->get(),
        ]);
    }

    public function store(SeoSettingRequest $request): RedirectResponse
    {
        $this->seoSettings->create(
            SeoSettingData::fromValidated($request->validated()),
            $request->file('og_image'),
            $request->user(),
        );

        return back()->with('success', 'SEO settings created.');
    }

    public function update(SeoSettingRequest $request, SeoSetting $seoSetting): RedirectResponse
    {
        $this->seoSettings->update(
            $seoSetting,
            SeoSettingData::fromValidated($request->validated()),
            $request->file('og_image'),
            $request->user(),
        );

        return back()->with('success', 'SEO settings updated.');
    }

    public function destroy(SeoSetting $seoSetting): RedirectResponse
    {
        $this->authorize('delete', $seoSetting);

        $this->seoSettings->delete($seoSetting, request()->user());

        return back()->with('success', 'SEO settings deleted.');
    }
}
