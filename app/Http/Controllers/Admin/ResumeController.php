<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ResumeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ResumeRequest;
use App\Models\Resume;
use App\Services\ResumeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Small, bounded list, modal-based CRUD like Certifications/SocialLinks -
 * each row is one role-tagged resume PDF (required on create, optional
 * replace on update), handled the same way as Certification's image.
 */
class ResumeController extends Controller
{
    public function __construct(private readonly ResumeService $resumes) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Resume::class);

        return Inertia::render('Admin/Resumes/Index', [
            'resumes' => Resume::query()
                ->orderBy('display_order')
                ->orderBy('role_title')
                ->get(),
        ]);
    }

    public function store(ResumeRequest $request): RedirectResponse
    {
        $this->resumes->create(
            ResumeData::fromValidated($request->validated()),
            $request->file('file'),
            $request->user(),
        );

        return back()->with('success', 'Resume uploaded.');
    }

    public function update(ResumeRequest $request, Resume $resume): RedirectResponse
    {
        $this->resumes->update(
            $resume,
            ResumeData::fromValidated($request->validated()),
            $request->file('file'),
            $request->user(),
        );

        return back()->with('success', 'Resume updated.');
    }

    public function destroy(Resume $resume): RedirectResponse
    {
        $this->authorize('delete', $resume);

        $this->resumes->delete($resume, request()->user());

        return back()->with('success', 'Resume deleted.');
    }
}
