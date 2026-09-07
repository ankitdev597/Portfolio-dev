<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\User;

class ActivityLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }
}
