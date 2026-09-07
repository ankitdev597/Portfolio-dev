<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Baseline roles + permissions. Current policies (App\Policies\*) gate
     * primarily on role, but the permission records are seeded now so
     * granular, per-action permissions can be introduced later (e.g. a
     * future "Contributor" role) without a schema change.
     */
    public function run(): void
    {
        $permissions = [
            'manage content',   // projects, skills, experience, services, taxonomies, ...
            'manage leads',     // leads + contact messages
            'manage settings',  // site_settings, seo_settings, integrations
            'manage users',     // create/deactivate/delete admin accounts
            'view activity log',
        ];

        foreach ($permissions as $permission) {
            Permission::query()->firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superAdmin = Role::query()->firstOrCreate(['name' => RoleName::SUPER_ADMIN->value, 'guard_name' => 'web']);
        $superAdmin->syncPermissions($permissions);

        $editor = Role::query()->firstOrCreate(['name' => RoleName::EDITOR->value, 'guard_name' => 'web']);
        $editor->syncPermissions(['manage content', 'manage leads']);
    }
}
