<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\SkillCategory;
use App\Models\SocialLink;
use App\Services\SiteSettingService;
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
    public function __invoke(SiteSettingService $siteSettings): Response
    {
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

            'whatsappLink' => $siteSettings->whatsappLink(),
        ]);
    }
}
