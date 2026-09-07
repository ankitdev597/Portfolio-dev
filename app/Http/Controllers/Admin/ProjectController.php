<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ProjectData;
use App\Enums\ProjectClassification;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Technology;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The largest Admin CMS resource (Phase 2, batch 2): full case-study
 * content, a thumbnail upload, and a technologies tag pivot. Unlike the
 * small, bounded taxonomy lists from batch 1 (modal-based, everything on
 * one screen), Projects can realistically grow to 20+ entries (spec
 * #11-13), so this gets dedicated Create/Edit pages and a paginated index
 * instead of a modal - the `PaginatedData<T>` shape already scaffolded in
 * Types/index.d.ts for exactly this case.
 */
class ProjectController extends Controller
{
    public function __construct(private readonly ProjectService $projects) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Project::class);

        $paginator = Project::query()
            ->with(['category:id,name', 'technologies:id,name'])
            ->orderBy('display_order')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        // Reshape into the `PaginatedData<T>` contract already scaffolded
        // in Types/index.d.ts ({data, links, meta}) - the plain
        // `LengthAwarePaginator::toArray()` output carries `data` and
        // `links` (url/label/active) at the top level plus the pagination
        // counters flat alongside them, so `meta` is assembled explicitly
        // here rather than assumed to exist on the paginator itself.
        $paginated = $paginator->toArray();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => [
                'data' => $paginated['data'],
                'links' => $paginated['links'],
                'meta' => [
                    'current_page' => $paginated['current_page'],
                    'last_page' => $paginated['last_page'],
                    'per_page' => $paginated['per_page'],
                    'total' => $paginated['total'],
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Admin/Projects/Create', $this->formProps());
    }

    public function store(ProjectRequest $request): RedirectResponse
    {
        $project = $this->projects->create(
            ProjectData::fromValidated($request->validated()),
            $request->file('thumbnail'),
            $request->user(),
        );

        return to_route('admin.projects.edit', $project)->with('success', 'Project created.');
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('Admin/Projects/Edit', [
            ...$this->formProps(),
            'project' => $project->load('technologies:id,name'),
        ]);
    }

    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $this->projects->update(
            $project,
            ProjectData::fromValidated($request->validated()),
            $request->file('thumbnail'),
            $request->user(),
        );

        return back()->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $this->projects->delete($project, request()->user());

        return to_route('admin.projects.index')->with('success', 'Project deleted.');
    }

    public function togglePublished(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $this->projects->togglePublished($project, request()->user());

        return back()->with('success', 'Project publish status updated.');
    }

    public function toggleFeatured(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $this->projects->toggleFeatured($project, request()->user());

        return back()->with('success', 'Project featured status updated.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'categories' => ProjectCategory::query()
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(['id', 'name']),

            'technologies' => Technology::query()
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(['id', 'name', 'category']),

            // Backed enums serialize to their bare scalar value via
            // json_encode (see TechnologyController) - map to {value, name}
            // explicitly rather than sending ProjectClassification::cases()
            // as-is.
            'classifications' => array_map(
                fn (ProjectClassification $case) => ['value' => $case->value, 'name' => $case->label()],
                ProjectClassification::cases(),
            ),
        ];
    }
}
