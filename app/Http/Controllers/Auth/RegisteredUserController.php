<?php

namespace App\Http\Controllers\Auth;

use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin-account provisioning. There is intentionally no public
 * registration route - a Super Admin invites Editors/Admins from the
 * Users screen (spec #27, #48).
 */
class RegisteredUserController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => array_map(fn (RoleName $role) => ['value' => $role->value, 'label' => $role->label()], RoleName::cases()),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        $this->activityLog->log(
            $request->user(),
            'created',
            "Created admin user \"{$user->name}\" ({$validated['role']})",
            $user,
        );

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }
}
