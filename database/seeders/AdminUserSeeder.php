<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seeds the one Super Admin account (Ankit) from env so no credential
     * is ever committed to source control. Set ADMIN_SEED_* in your local
     * .env before running `php artisan db:seed` (see .env.example).
     */
    public function run(): void
    {
        $email = (string) env('ADMIN_SEED_EMAIL', 'developerankit597@gmail.com');
        $password = (string) env('ADMIN_SEED_PASSWORD');

        if (blank($password) || $password === 'change-me-before-seeding') {
            $this->command?->warn(
                'ADMIN_SEED_PASSWORD is not set (or still the placeholder) in .env - '
                .'skipping admin user creation. Set it and re-run: php artisan db:seed --class=AdminUserSeeder'
            );

            return;
        }

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => (string) env('ADMIN_SEED_NAME', 'Ankit Vishwakarma'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        $user->syncRoles([RoleName::SUPER_ADMIN->value]);

        Profile::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'full_name' => 'Ankit Vishwakarma',
                'headline' => 'Senior Software Engineer | Full Stack Developer | AI | DevOps',
                'tagline' => 'Full Stack Development • AI/LLM Integration • Cloud & DevOps',
                'years_experience' => 4,
                'short_bio' => 'Senior Software Engineer with 4+ years of experience across full-stack development, AI/LLM integration, real-time applications, and cloud/DevOps.',
                'bio' => null, // Full narrative bio to be written/edited from the admin CMS.
                'philosophy' => null,
                'availability_status' => 'available',
            ]
        );
    }
}
