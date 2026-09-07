<?php

namespace App\DTOs;

final readonly class SocialLinkData
{
    public function __construct(
        public string $platform,
        public ?string $label,
        public string $url,
        public ?string $icon,
        public bool $isActive,
        public int $displayOrder,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            platform: $validated['platform'],
            label: $validated['label'] ?? null,
            url: $validated['url'],
            icon: $validated['icon'] ?? null,
            isActive: (bool) ($validated['is_active'] ?? false),
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
