<?php

namespace App\DTOs;

final readonly class EducationData
{
    public function __construct(
        public string $institution,
        public string $degree,
        public ?string $fieldOfStudy,
        public ?string $startDate,
        public ?string $endDate,
        public ?string $description,
        public int $displayOrder,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            institution: $validated['institution'],
            degree: $validated['degree'],
            fieldOfStudy: $validated['field_of_study'] ?? null,
            startDate: $validated['start_date'] ?? null,
            endDate: $validated['end_date'] ?? null,
            description: $validated['description'] ?? null,
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
