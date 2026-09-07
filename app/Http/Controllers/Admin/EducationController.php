<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\EducationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EducationRequest;
use App\Models\Education;
use App\Services\EducationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends Controller
{
    public function __construct(private readonly EducationService $education) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Education::class);

        return Inertia::render('Admin/Education/Index', [
            'educations' => Education::query()
                ->orderByDesc('start_date')
                ->get(),
        ]);
    }

    public function store(EducationRequest $request): RedirectResponse
    {
        $this->education->create(
            EducationData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Education created.');
    }

    public function update(EducationRequest $request, Education $education): RedirectResponse
    {
        $this->education->update(
            $education,
            EducationData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Education updated.');
    }

    public function destroy(Education $education): RedirectResponse
    {
        $this->authorize('delete', $education);

        $this->education->delete($education, request()->user());

        return back()->with('success', 'Education deleted.');
    }
}
