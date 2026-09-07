<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ProfileData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfileRequest;
use App\Models\Profile;
use App\Services\ProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Manages the single public-facing Profile row (bio/headline/avatar/resume
 * shown on the portfolio). Deliberately not a resource controller - there
 * is exactly one row, seeded once in AdminUserSeeder, so this is just
 * edit()/update() with a resolve-or-build fallback in case that row is
 * ever missing.
 */
class ProfileController extends Controller
{
    public function __construct(private readonly ProfileService $profiles) {}

    public function edit(): Response
    {
        $this->authorize('update', Profile::class);

        return Inertia::render('Admin/Profile/Edit', [
            'profile' => Profile::query()->first(),
        ]);
    }

    public function update(ProfileRequest $request): RedirectResponse
    {
        $profile = Profile::query()->first() ?? new Profile();

        $this->profiles->save(
            $profile,
            ProfileData::fromValidated($request->validated()),
            $request->file('avatar'),
            $request->file('resume'),
            $request->user(),
        );

        return back()->with('success', 'Profile updated.');
    }
}
