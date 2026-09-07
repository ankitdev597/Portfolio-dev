<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\User;

/**
 * Shared authorization rules for every "site content" resource that Editors
 * and Super Admins manage identically (projects, skills, experience,
 * services, certifications, social links, taxonomies, ...).
 *
 * Bound to each concrete model explicitly in AppServiceProvider::boot()
 * via Gate::policy(), rather than duplicated per model, to keep the CMS
 * authorization rules DRY and in one auditable place.
 */
class ContentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([RoleName::SUPER_ADMIN->value, RoleName::EDITOR->value]);
    }

    public function view(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function restore(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }

    public function forceDelete(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }
}
