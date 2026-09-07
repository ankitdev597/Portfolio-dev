<?php

namespace App\DTOs;

final readonly class SeoSettingData
{
    /**
     * The og:image upload is deliberately NOT a DTO field - same
     * convention as Project/Certification/Profile: the controller passes
     * the UploadedFile through to the Service as its own argument, the DTO
     * only carries the remove-existing-image intent.
     */
    public function __construct(
        public string $pageKey,
        public ?string $title,
        public ?string $description,
        public ?string $canonicalUrl,
        public ?string $keywords,
        public bool $removeOgImage,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            pageKey: $validated['page_key'],
            title: $validated['title'] ?? null,
            description: $validated['description'] ?? null,
            canonicalUrl: $validated['canonical_url'] ?? null,
            keywords: $validated['keywords'] ?? null,
            removeOgImage: (bool) ($validated['remove_og_image'] ?? false),
        );
    }
}
