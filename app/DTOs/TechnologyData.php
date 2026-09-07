<?php

namespace App\DTOs;

use App\Enums\TechnologyCategory;

/**
 * Immutable payload for creating/updating a Technology, decoupled from the
 * HTTP layer so App\Services\TechnologyService never has to know about
 * FormRequest objects (project rule: business logic lives in Services,
 * DTOs carry the data across that boundary).
 */
final readonly class TechnologyData
{
    public function __construct(
        public string $name,
        public ?string $slug,
        public ?string $icon,
        public ?string $color,
        public TechnologyCategory $category,
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
            color: $validated['color'] ?? null,
            category: TechnologyCategory::from($validated['category']),
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
