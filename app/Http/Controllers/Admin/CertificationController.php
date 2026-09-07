<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\CertificationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CertificationRequest;
use App\Models\Certification;
use App\Services\CertificationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Small, bounded list, modal-based like batch 1's taxonomies - the one
 * wrinkle being the badge/logo image upload, handled the same way as
 * Projects' thumbnail (file passed through to the Service, never touched
 * directly here).
 */
class CertificationController extends Controller
{
    public function __construct(private readonly CertificationService $certifications) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Certification::class);

        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => Certification::query()
                ->orderBy('display_order')
                ->orderByDesc('issue_date')
                ->get(),
        ]);
    }

    public function store(CertificationRequest $request): RedirectResponse
    {
        $this->certifications->create(
            CertificationData::fromValidated($request->validated()),
            $request->file('image'),
            $request->user(),
        );

        return back()->with('success', 'Certification created.');
    }

    public function update(CertificationRequest $request, Certification $certification): RedirectResponse
    {
        $this->certifications->update(
            $certification,
            CertificationData::fromValidated($request->validated()),
            $request->file('image'),
            $request->user(),
        );

        return back()->with('success', 'Certification updated.');
    }

    public function destroy(Certification $certification): RedirectResponse
    {
        $this->authorize('delete', $certification);

        $this->certifications->delete($certification, request()->user());

        return back()->with('success', 'Certification deleted.');
    }
}
