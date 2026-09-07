<?php

namespace App\DTOs;

final readonly class ServiceData
{
    public function __construct(
        public string $title,
        public ?string $slug,
        public string $shortDescription,
        public ?string $description,
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
            title: $validated['title'],
            slug: $validated['slug'] ?? null,
            shortDescription: $validated['short_description'],
            description: $validated['description'] ?? null,
            icon: $validated['icon'] ?? null,
            isActive: (bool) ($validated['is_active'] ?? false),
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
