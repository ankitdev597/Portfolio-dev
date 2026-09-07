<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\User;

class ContactMessagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([RoleName::SUPER_ADMIN->value, RoleName::EDITOR->value]);
    }

    public function view(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user): bool
    {
        // Marking read/replied/archived is fine for Editors.
        return $this->viewAny($user);
    }

    public function delete(User $user): bool
    {
        // Permanently destroying inbound leads/messages is Super Admin only.
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }
}
