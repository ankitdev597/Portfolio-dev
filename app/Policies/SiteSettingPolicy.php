<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\User;

/**
 * Critical system configuration (site_settings, seo_settings, broadcasting
 * keys, mail, integrations) is Super Admin only per the CMS spec: Editors
 * get content management but never system settings or user management.
 */
class SiteSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }

    public function update(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }

    public function delete(User $user): bool
    {
        return $user->hasRole(RoleName::SUPER_ADMIN->value);
    }
}
