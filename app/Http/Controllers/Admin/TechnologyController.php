<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TechnologyCategory;
use App\DTOs\TechnologyData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TechnologyRequest;
use App\Models\Technology;
use App\Services\TechnologyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Shared taxonomy used to tag both Experience and Project entries (spec:
 * "technologies" powers the skills constellation and project tech-stack
 * chips). Small, bounded list - returned as a single ordered collection
 * rather than paginated so the admin can see and reorder everything at
 * once (see App\Providers\AppServiceProvider for the ContentPolicy binding
 * that authorizes every action here).
 */
class TechnologyController extends Controller
{
    public function __construct(private readonly TechnologyService $technologies) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Technology::class);

        return Inertia::render('Admin/Technologies/Index', [
            'technologies' => Technology::query()
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(),
            // Backed enums serialize to their bare scalar value via
            // json_encode (no name/label), so map to {value, name}
            // explicitly for the <select> options rather than relying on
            // TechnologyCategory::cases() being sent as-is.
            'categories' => array_map(
                fn (TechnologyCategory $case) => ['value' => $case->value, 'name' => $case->label()],
                TechnologyCategory::cases(),
            ),
        ]);
    }

    public function store(TechnologyRequest $request): RedirectResponse
    {
        $this->technologies->create(
            TechnologyData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Technology created.');
    }

    public function update(TechnologyRequest $request, Technology $technology): RedirectResponse
    {
        $this->technologies->update(
            $technology,
            TechnologyData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Technology updated.');
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        $this->authorize('delete', $technology);

        $this->technologies->delete($technology, request()->user());

        return back()->with('success', 'Technology deleted.');
    }
}
