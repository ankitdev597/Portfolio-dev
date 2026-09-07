<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Super-Admin-only user management (spec #27, #48). Creation is handled by
 * Auth\RegisteredUserController (invite-style, no public self-registration);
 * this controller covers listing, role changes, and deactivation/removal.
 *
 * Route-level `role:super_admin` middleware (routes/web.php) keeps Editors
 * out entirely; the UserPolicy::authorize() calls below are defense in
 * depth, not the primary gate.
 */
class UserController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->with('roles:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'is_active', 'last_login_at', 'created_at']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $user->update($validated);

        $this->activityLog->log(
            $request->user(),
            'updated',
            ($validated['is_active'] ? 'Activated' : 'Deactivated')." user \"{$user->name}\"",
            $user,
        );

        return back()->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $name = $user->name;
        $user->delete();

        $this->activityLog->log($request->user(), 'deleted', "Deleted user \"{$name}\"");

        return back()->with('success', 'User deleted.');
    }
}
