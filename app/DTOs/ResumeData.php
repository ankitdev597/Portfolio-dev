<?php

namespace App\DTOs;

final readonly class ResumeData
{
    /**
     * The uploaded PDF is deliberately NOT a DTO field - same convention as
     * CertificationData/ProfileData: the controller passes the
     * UploadedFile through to the Service as its own argument
     * (`$request->file('file')`).
     */
    public function __construct(
        public string $roleTitle,
        public ?string $label,
        public bool $isActive,
        public int $displayOrder,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            roleTitle: $validated['role_title'],
            label: $validated['label'] ?? null,
            isActive: (bool) ($validated['is_active'] ?? true),
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
