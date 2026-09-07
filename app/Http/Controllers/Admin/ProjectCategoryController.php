<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ProjectCategoryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectCategoryRequest;
use App\Models\ProjectCategory;
use App\Services\ProjectCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectCategoryController extends Controller
{
    public function __construct(private readonly ProjectCategoryService $categories) {}

    public function index(): Response
    {
        $this->authorize('viewAny', ProjectCategory::class);

        return Inertia::render('Admin/ProjectCategories/Index', [
            'categories' => ProjectCategory::query()
                ->withCount('projects')
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(ProjectCategoryRequest $request): RedirectResponse
    {
        $this->categories->create(
            ProjectCategoryData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Project category created.');
    }

    public function update(ProjectCategoryRequest $request, ProjectCategory $projectCategory): RedirectResponse
    {
        $this->categories->update(
            $projectCategory,
            ProjectCategoryData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Project category updated.');
    }

    public function destroy(ProjectCategory $projectCategory): RedirectResponse
    {
        $this->authorize('delete', $projectCategory);

        $this->categories->delete($projectCategory, request()->user());

        return back()->with('success', 'Project category deleted.');
    }
}
