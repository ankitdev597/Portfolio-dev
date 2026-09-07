<?php

namespace App\DTOs;

final readonly class SkillData
{
    public function __construct(
        public int $skillCategoryId,
        public string $name,
        public ?string $icon,
        public ?int $proficiency,
        public bool $isFeatured,
        public int $displayOrder,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            skillCategoryId: (int) $validated['skill_category_id'],
            name: $validated['name'],
            icon: $validated['icon'] ?? null,
            proficiency: isset($validated['proficiency']) ? (int) $validated['proficiency'] : null,
            isFeatured: (bool) ($validated['is_featured'] ?? false),
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
