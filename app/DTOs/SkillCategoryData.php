<?php

namespace App\DTOs;

final readonly class SkillCategoryData
{
    public function __construct(
        public string $name,
        public ?string $slug,
        public ?string $icon,
        public int $displayOrder,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            slug: $validated['slug'] ?? null,
            icon: $validated['icon'] ?? null,
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
