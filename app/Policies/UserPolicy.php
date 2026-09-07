<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value) || $user->is($model);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value) || $user->is($model);
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value) && ! $user->is($model);
    }
}
