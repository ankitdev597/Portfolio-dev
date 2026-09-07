<?php

namespace App\DTOs;

final readonly class ProfileData
{
    /**
     * The uploaded avatar/resume files are deliberately NOT DTO fields -
     * same convention as Project/Certification: the controller passes each
     * UploadedFile through to the Service as its own argument, the DTO only
     * carries the remove-existing-file intents.
     */
    public function __construct(
        public string $fullName,
        public string $headline,
        public ?string $tagline,
        public int $yearsExperience,
        public ?string $bio,
        public ?string $shortBio,
        public ?string $philosophy,
        public ?string $location,
        public ?string $availabilityStatus,
        public bool $removeAvatar,
        public bool $removeResume,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            fullName: $validated['full_name'],
            headline: $validated['headline'],
            tagline: $validated['tagline'] ?? null,
            yearsExperience: (int) ($validated['years_experience'] ?? 0),
            bio: $validated['bio'] ?? null,
            shortBio: $validated['short_bio'] ?? null,
            philosophy: $validated['philosophy'] ?? null,
            location: $validated['location'] ?? null,
            availabilityStatus: $validated['availability_status'] ?? null,
            removeAvatar: (bool) ($validated['remove_avatar'] ?? false),
            removeResume: (bool) ($validated['remove_resume'] ?? false),
        );
    }
}
