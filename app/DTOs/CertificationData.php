<?php

namespace App\DTOs;

final readonly class CertificationData
{
    /**
     * The uploaded image file itself is deliberately NOT a DTO field - same
     * convention as ProjectData/removeThumbnail: the controller passes the
     * UploadedFile through to the Service as its own argument
     * (`$request->file('image')`), the DTO only carries the
     * remove-existing-image intent.
     */
    public function __construct(
        public string $title,
        public string $issuingOrganization,
        public ?string $issueDate,
        public ?string $expiryDate,
        public ?string $credentialId,
        public ?string $credentialUrl,
        public bool $removeImage,
        public int $displayOrder,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            title: $validated['title'],
            issuingOrganization: $validated['issuing_organization'],
            issueDate: $validated['issue_date'] ?? null,
            expiryDate: $validated['expiry_date'] ?? null,
            credentialId: $validated['credential_id'] ?? null,
            credentialUrl: $validated['credential_url'] ?? null,
            removeImage: (bool) ($validated['remove_image'] ?? false),
            displayOrder: (int) ($validated['display_order'] ?? 0),
        );
    }
}
