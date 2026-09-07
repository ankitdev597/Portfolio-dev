<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\SkillCategoryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillCategoryRequest;
use App\Models\SkillCategory;
use App\Services\SkillCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Skill categories + their nested skills are managed from one screen
 * (Admin/SkillCategories/Index.tsx) rather than two separate CRUD pages,
 * since a skill never makes sense without its category in view. Skill
 * create/update/delete itself is handled by SkillController.
 */
class SkillCategoryController extends Controller
{
    public function __construct(private readonly SkillCategoryService $categories) {}

    public function index(): Response
    {
        $this->authorize('viewAny', SkillCategory::class);

        return Inertia::render('Admin/SkillCategories/Index', [
            // Skill::category() ordering is already applied by
            // SkillCategory::skills() (orderBy('display_order')) - no need
            // to repeat it here.
            'categories' => SkillCategory::query()
                ->with('skills')
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(SkillCategoryRequest $request): RedirectResponse
    {
        $this->categories->create(
            SkillCategoryData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Skill category created.');
    }

    public function update(SkillCategoryRequest $request, SkillCategory $skillCategory): RedirectResponse
    {
        $this->categories->update(
            $skillCategory,
            SkillCategoryData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Skill category updated.');
    }

    public function destroy(SkillCategory $skillCategory): RedirectResponse
    {
        $this->authorize('delete', $skillCategory);

        $this->categories->delete($skillCategory, request()->user());

        return back()->with('success', 'Skill category deleted.');
    }
}
