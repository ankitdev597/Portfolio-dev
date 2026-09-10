<?php

namespace Database\Seeders;

use App\Models\Resume;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Seeds a default resume from a PDF bundled in the repo (see
 * database/seeders/assets/resumes/) so the public Resume section always has
 * something to show/download out of the box, without requiring a first
 * manual upload through Admin -> Resumes. Idempotent and disk-agnostic: it
 * writes through Storage::disk('public') exactly like ResumeService does,
 * so on every boot it re-copies the bundled file only if that path is
 * missing from whichever disk is active (local dev, or R2/S3 in
 * production) - the same self-healing shape as RealProjectSeeder, and the
 * reason this survives Render's ephemeral local disk even before R2 is
 * wired up: it just re-appears on the next boot instead of staying lost.
 */
class ResumeSeeder extends Seeder
{
    private const DISK = 'public';

    private const STORED_PATH = 'resumes/ankit-vishwakarma-fullstack-developer.pdf';

    private const SOURCE_ASSET = __DIR__.'/assets/resumes/ankit-vishwakarma-fullstack-developer.pdf';

    public function run(): void
    {
        if (! is_file(self::SOURCE_ASSET)) {
            return;
        }

        if (! Storage::disk(self::DISK)->exists(self::STORED_PATH)) {
            Storage::disk(self::DISK)->put(self::STORED_PATH, file_get_contents(self::SOURCE_ASSET));
        }

        Resume::query()->updateOrCreate(
            ['role_title' => 'Full Stack Developer'],
            [
                'label' => 'Laravel, React & Cloud',
                'file_path' => self::STORED_PATH,
                'file_original_name' => 'Ankit_Vishwakarma_FullStack_Developer_Resume.pdf',
                'is_active' => true,
                'display_order' => 1,
            ]
        );
    }
}
