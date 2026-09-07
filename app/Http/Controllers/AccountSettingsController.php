<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Manages the logged-in admin's OWN account (name/email/password) - the
 * Breeze-style "my account" page.
 *
 * Deliberately not named ProfileController: App\Models\Profile is the
 * public-facing CMS content (Ankit's bio/headline/resume shown on the
 * portfolio) managed from Admin/ProfileController in the CMS phase. Two
 * different concerns; two different names, to avoid confusing the two in
 * routes, policies, and code review.
 */
class AccountSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Admin/Account/Edit', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('admin.account.edit')->with('success', 'Account updated.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        \Illuminate\Support\Facades\Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
