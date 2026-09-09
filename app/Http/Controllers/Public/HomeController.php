<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Resume;
use App\Models\SeoSetting;
use App\Models\Service;
use App\Models\SkillCategory;
use App\Models\SocialLink;
use App\Services\SiteSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The full single-page portfolio: hero, about, skills, experience,
 * projects, services, contact - all real database-backed content (no
 * hardcoded copy anywhere below), matching the same query pattern already
 * used by the Admin CMS index() actions (see Admin\TechnologyController
 * etc.) rather than introducing a one-off "page composition" service for
 * what is, here, a handful of read-only, unrelated queries.
 */
class HomeController extends Controller
{
    public function __invoke(Request $request, SiteSettingService $siteSettings): Response
    {
        $seoSetting = SeoSetting::query()->where('page_key', 'home')->first();

        return Inertia::render('Public/Welcome', [
            // Single-profile site (one CMS owner) - `first()` rather than a
            // hardcoded ID stays correct even if the admin user is ever
            // recreated with a different ID.
            'profile' => Profile::query()->first(),

            'skillCategories' => SkillCategory::query()
                ->with('skills')
                ->orderBy('display_order')
                ->get(),

            'experiences' => Experience::query()
                ->with('technologies:id,name')
                ->ordered()
                ->get(),

            'services' => Service::query()
                ->active()
                ->orderBy('display_order')
                ->get(),

            // Deliberately empty until a project is actually published from
            // the admin CMS (spec: never show draft/unpublished content
            // publicly) - the frontend renders a "launching soon" state
            // when this is empty rather than treating it as an error.
            'projects' => Project::query()
                ->published()
                ->ordered()
                ->with('technologies:id,name')
                ->get(['id', 'title', 'slug', 'short_description', 'thumbnail_path', 'classification', 'is_featured', 'github_url', 'live_url']),

            'socialLinks' => SocialLink::query()->active()->get(),

            // Role-tagged resume PDFs (see routes/web.php) - deliberately
            // empty until the admin uploads at least one, same
            // never-show-unpublished-content shape as `projects` above.
            'resumes' => Resume::query()->active()->get(),

            'whatsappLink' => $siteSettings->whatsappLink(),

            // Consolidated so Welcome.tsx's <Head> never has to fall back
            // across two different prop shapes - SeoSetting (per-page,
            // admin-managed) wins, then site_settings' generic meta_title/
            // meta_description (spec: "og image for seo all of thing").
            'seo' => [
                'title' => $seoSetting?->title ?? $siteSettings->get('meta_title') ?? $siteSettings->get('site_title'),
                'description' => $seoSetting?->description ?? $siteSettings->get('meta_description'),
                'keywords' => $seoSetting?->keywords,
                'ogImageUrl' => $seoSetting?->og_image_url ?? $siteSettings->imageUrl('logo'),
                'canonicalUrl' => $seoSetting?->canonical_url ?? $request->url(),
            ],
        ]);
    }
}
