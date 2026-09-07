<?php

namespace App\DTOs;

final readonly class ProjectCategoryData
{
    public function __construct(
        public string $name,
        public ?string $slug,
        public ?string $description,
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
            description: $validated['description'] ?? null,
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
