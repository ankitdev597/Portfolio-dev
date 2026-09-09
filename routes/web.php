<?php

use App\Enums\RoleName;
use App\Http\Controllers\Admin\CertificationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EducationController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ProjectCategoryController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ResumeController;
use App\Http\Controllers\Admin\SeoSettingController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\SkillCategoryController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\SocialLinkController;
use App\Http\Controllers\Admin\TechnologyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AccountSettingsController;
use App\Http\Controllers\Public\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public site
|--------------------------------------------------------------------------
| The full public portfolio (hero, about, experience, skills, projects,
| services, contact) is built out phase by phase against real
| database-backed content. This route/controller/page wiring is the
| Phase-1 skeleton it will grow from.
*/
Route::get('/', HomeController::class)->name('home');

/*
|--------------------------------------------------------------------------
| Admin CMS / CRM
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('account', [AccountSettingsController::class, 'edit'])->name('account.edit');
    Route::patch('account', [AccountSettingsController::class, 'update'])->name('account.update');
    Route::delete('account', [AccountSettingsController::class, 'destroy'])->name('account.destroy');

    /*
    |----------------------------------------------------------------------
    | Admin CMS - content (Phase 2, batch 1: taxonomies)
    |----------------------------------------------------------------------
    | Open to both super_admin and editor - App\Policies\ContentPolicy
    | (bound per-model in AppServiceProvider) is the actual gate, checked
    | via $this->authorize()/FormRequest::authorize() in each controller.
    | No extra `role:` middleware here - that's only for the Super-Admin-only
    | group below.
    */
    Route::resource('technologies', TechnologyController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    // Explicit camelCase parameter names below so the {wildcard} in each
    // route matches the controller method's variable name exactly
    // (Illuminate\Routing\ImplicitRouteBinding matches by that name -
    // "skill_category" would NOT bind to a $skillCategory argument).
    Route::resource('skill-categories', SkillCategoryController::class)
        ->parameters(['skill-categories' => 'skillCategory'])
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('skills', SkillController::class)
        ->only(['store', 'update', 'destroy']);

    Route::resource('project-categories', ProjectCategoryController::class)
        ->parameters(['project-categories' => 'projectCategory'])
        ->only(['index', 'store', 'update', 'destroy']);

    // Batch 2: the full Projects CRUD (case-study content, thumbnail
    // upload, technologies pivot). No `show` - there's no public project
    // detail page yet for the admin route to preview into.
    Route::resource('projects', ProjectController::class)->except(['show']);

    Route::patch('projects/{project}/toggle-published', [ProjectController::class, 'togglePublished'])
        ->name('projects.toggle-published');
    Route::patch('projects/{project}/toggle-featured', [ProjectController::class, 'toggleFeatured'])
        ->name('projects.toggle-featured');

    // Batch 3: Experience + Education - small bounded lists, modal-based
    // CRUD like batch 1's taxonomies.
    Route::resource('experience', ExperienceController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('education', EducationController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    // Batch 4: Services, Certifications, Social Links - all small bounded
    // lists, modal-based CRUD like batches 1 and 3. Certifications is the
    // one with a file upload (badge/logo image), handled the same way as
    // Projects' thumbnail.
    Route::resource('services', ServiceController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('certifications', CertificationController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('social-links', SocialLinkController::class)
        ->parameters(['social-links' => 'socialLink'])
        ->only(['index', 'store', 'update', 'destroy']);

    // Role-tagged resume PDFs (e.g. "Backend Developer", "Full Stack
    // Developer") shown on the public Resume section - small bounded
    // list, modal-based CRUD like the rest of this batch. Distinct from
    // the single bio resume on Profile below: that one is the owner's
    // general CV, these are purpose-built variants a visitor can pick
    // between by role.
    Route::resource('resumes', ResumeController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    // Batch 5: the public-facing Profile (bio/avatar/resume) - a single
    // row, so plain edit/update rather than a resource. Editor-manageable
    // content, same ContentPolicy as everything else in this block.
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');

    // Super-Admin-only: user provisioning and system-critical settings.
    // Editors get full content management (wired up in the Admin CMS
    // phase) but never reach this group - enforced here, not just hidden
    // in the UI, per the project's role-based access rule.
    Route::middleware('role:'.RoleName::SUPER_ADMIN->value)->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/create', [RegisteredUserController::class, 'create'])->name('users.create');
        Route::post('users', [RegisteredUserController::class, 'store'])->name('users.store');
        Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Batch 5: system-critical site/SEO configuration - SiteSettingPolicy
        // gates these separately from ContentPolicy (see AppServiceProvider).
        Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
        Route::patch('settings', [SiteSettingController::class, 'update'])->name('settings.update');

        Route::resource('seo-settings', SeoSettingController::class)
            ->parameters(['seo-settings' => 'seoSetting'])
            ->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/auth.php';
