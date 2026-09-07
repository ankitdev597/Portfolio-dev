<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ExperienceData;
use App\Enums\EmploymentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExperienceRequest;
use App\Models\Experience;
use App\Models\Technology;
use App\Services\ExperienceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Small, bounded list (a handful of jobs, not hundreds) - modal-based CRUD
 * on one screen, same shape as Phase 2 batch 1's taxonomies, rather than
 * Projects' dedicated paginated pages.
 */
class ExperienceController extends Controller
{
    public function __construct(private readonly ExperienceService $experiences) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Experience::class);

        return Inertia::render('Admin/Experience/Index', [
            'experiences' => Experience::query()
                ->with('technologies:id,name')
                ->orderByDesc('start_date')
                ->get(),

            'technologies' => Technology::query()
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(['id', 'name', 'category']),

            // Backed enums serialize to their bare scalar value via
            // json_encode - map to {value, name} explicitly (see
            // TechnologyController).
            'employmentTypes' => array_map(
                fn (EmploymentType $case) => ['value' => $case->value, 'name' => $case->label()],
                EmploymentType::cases(),
            ),
        ]);
    }

    public function store(ExperienceRequest $request): RedirectResponse
    {
        $this->experiences->create(
            ExperienceData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Experience created.');
    }

    public function update(ExperienceRequest $request, Experience $experience): RedirectResponse
    {
        $this->experiences->update(
            $experience,
            ExperienceData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Experience updated.');
    }

    public function destroy(Experience $experience): RedirectResponse
    {
        $this->authorize('delete', $experience);

        $this->experiences->delete($experience, request()->user());

        return back()->with('success', 'Experience deleted.');
    }
}
