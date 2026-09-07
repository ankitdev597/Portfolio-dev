<?php

namespace App\Providers;

use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\SeoSetting;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\SocialLink;
use App\Models\Technology;
use App\Policies\ContentPolicy;
use App\Policies\SiteSettingPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configurePolicies();
        $this->configureRateLimiting();
        $this->configureModelDefaults();

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Inertia::share('appVersion', config('app.version', '1.0.0'));
    }

    /**
     * The generic ContentPolicy is bound to every editor-manageable content
     * model here rather than duplicated as one policy class per model
     * (DRY). Resources with distinct rules (settings, users) get their own
     * dedicated policy.
     */
    private function configurePolicies(): void
    {
        foreach ([
            Project::class,
            ProjectCategory::class,
            Technology::class,
            Skill::class,
            SkillCategory::class,
            Experience::class,
            Education::class,
            Profile::class,
            Service::class,
            Certification::class,
            SocialLink::class,
        ] as $model) {
            Gate::policy($model, ContentPolicy::class);
        }

        Gate::policy(SiteSetting::class, SiteSettingPolicy::class);
        Gate::policy(SeoSetting::class, SiteSettingPolicy::class);
    }

    private function configureRateLimiting(): void
    {
        // Public contact form: generous enough for a genuine visitor,
        // strict enough to blunt scripted spam (see StoreContactMessageRequest).
        RateLimiter::for('contact-form', function ($request) {
            return [
                Limit::perMinute(3)->by($request->ip()),
                Limit::perDay(20)->by($request->ip()),
            ];
        });

        RateLimiter::for('login', function ($request) {
            return Limit::perMinute(5)->by($request->string('email').'|'.$request->ip());
        });
    }

    private function configureModelDefaults(): void
    {
        \Illuminate\Database\Eloquent\Model::shouldBeStrict(! $this->app->isProduction());
        \Illuminate\Database\Eloquent\Model::unguard(false);
    }
}
