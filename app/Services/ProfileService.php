<?php

namespace App\Services;

use App\DTOs\ProfileData;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Same "file uploads go through a Service" shape as ProjectService/
 * CertificationService, doubled up for the two independent uploads a
 * Profile carries (avatar image, resume PDF). `save()` covers both the
 * create-if-missing and update paths - there is only ever one Profile row,
 * so the controller resolves-or-builds it and this Service just persists
 * whatever it's handed.
 */
class ProfileService
{
    private const DISK = 'public';

    private const AVATAR_DIRECTORY = 'avatars';

    private const RESUME_DIRECTORY = 'resumes';

    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function save(
        Profile $profile,
        ProfileData $data,
        ?UploadedFile $avatar,
        ?UploadedFile $resume,
        User $actor,
    ): Profile {
        $isNew = ! $profile->exists;

        $profile->fill([
            'user_id' => $profile->user_id ?? $actor->id,
            'full_name' => $data->fullName,
            'headline' => $data->headline,
            'tagline' => $data->tagline,
            'years_experience' => $data->yearsExperience,
            'bio' => $data->bio,
            'short_bio' => $data->shortBio,
            'philosophy' => $data->philosophy,
            'avatar_path' => $this->resolveAvatarPath($profile, $data, $avatar),
            'location' => $data->location,
            'availability_status' => $data->availabilityStatus,
        ]);

        $this->applyResume($profile, $data, $resume);

        $profile->save();

        $this->activityLog->log(
            $actor,
            $isNew ? 'created' : 'updated',
            ($isNew ? 'Created' : 'Updated')." profile \"{$profile->full_name}\"",
            $profile,
        );

        return $profile;
    }

    private function resolveAvatarPath(Profile $profile, ProfileData $data, ?UploadedFile $newAvatar): ?string
    {
        $currentPath = $profile->avatar_path;

        if ($newAvatar) {
            if ($currentPath) {
                Storage::disk(self::DISK)->delete($currentPath);
            }

            return $newAvatar->store(self::AVATAR_DIRECTORY, self::DISK);
        }

        if ($data->removeAvatar && $currentPath) {
            Storage::disk(self::DISK)->delete($currentPath);

            return null;
        }

        return $currentPath;
    }

    private function applyResume(Profile $profile, ProfileData $data, ?UploadedFile $newResume): void
    {
        $currentPath = $profile->resume_path;

        if ($newResume) {
            if ($currentPath) {
                Storage::disk(self::DISK)->delete($currentPath);
            }

            $profile->resume_path = $newResume->store(self::RESUME_DIRECTORY, self::DISK);
            $profile->resume_original_name = $newResume->getClientOriginalName();

            return;
        }

        if ($data->removeResume && $currentPath) {
            Storage::disk(self::DISK)->delete($currentPath);
            $profile->resume_path = null;
            $profile->resume_original_name = null;
        }
    }
}
