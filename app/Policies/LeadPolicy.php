<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([RoleName::SUPER_ADMIN->value, RoleName::EDITOR->value]);
    }

    public function view(User $user, Lead $lead): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Lead $lead): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Lead $lead): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }
}
