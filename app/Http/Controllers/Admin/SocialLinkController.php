<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\SocialLinkData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SocialLinkRequest;
use App\Models\SocialLink;
use App\Services\SocialLinkService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Small, bounded list (like batch 1's taxonomies) - modal-based CRUD, one
 * ordered collection, no pagination.
 */
class SocialLinkController extends Controller
{
    public function __construct(private readonly SocialLinkService $socialLinks) {}

    public function index(): Response
    {
        $this->authorize('viewAny', SocialLink::class);

        return Inertia::render('Admin/SocialLinks/Index', [
            'socialLinks' => SocialLink::query()
                ->orderBy('display_order')
                ->orderBy('platform')
                ->get(),
        ]);
    }

    public function store(SocialLinkRequest $request): RedirectResponse
    {
        $this->socialLinks->create(
            SocialLinkData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Social link created.');
    }

    public function update(SocialLinkRequest $request, SocialLink $socialLink): RedirectResponse
    {
        $this->socialLinks->update(
            $socialLink,
            SocialLinkData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Social link updated.');
    }

    public function destroy(SocialLink $socialLink): RedirectResponse
    {
        $this->authorize('delete', $socialLink);

        $this->socialLinks->delete($socialLink, request()->user());

        return back()->with('success', 'Social link deleted.');
    }
}
