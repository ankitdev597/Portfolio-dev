<?php

namespace App\DTOs;

final readonly class ExperienceData
{
    /**
     * @param  int[]  $technologyIds
     */
    public function __construct(
        public string $companyName,
        public string $roleTitle,
        public string $employmentType,
        public ?string $location,
        public string $startDate,
        public ?string $endDate,
        public bool $isCurrent,
        public ?string $description,
        public int $displayOrder,
        public array $technologyIds,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            companyName: $validated['company_name'],
            roleTitle: $validated['role_title'],
            employmentType: $validated['employment_type'],
            location: $validated['location'] ?? null,
            startDate: $validated['start_date'],
            // A current role has no end date regardless of what was
            // submitted - is_current is the source of truth, not
            // whatever the (likely disabled) end_date field last held.
            endDate: (bool) ($validated['is_current'] ?? false) ? null : ($validated['end_date'] ?? null),
            isCurrent: (bool) ($validated['is_current'] ?? false),
            description: $validated['description'] ?? null,
            displayOrder: (int) ($validated['display_order'] ?? 0),
            technologyIds: array_map('intval', $validated['technology_ids'] ?? []),
        );
    }
}
