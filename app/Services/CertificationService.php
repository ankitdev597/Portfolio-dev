<?php

namespace App\Services;

use App\DTOs\CertificationData;
use App\Models\Certification;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Same "file uploads go through a Service, never the controller" shape as
 * ProjectService's thumbnail handling - store-on-create,
 * replace-and-delete-old-on-update, delete-on-remove-checkbox, all behind
 * Storage::disk('public').
 */
class CertificationService
{
    private const IMAGE_DISK = 'public';

    private const IMAGE_DIRECTORY = 'certifications';

    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(CertificationData $data, ?UploadedFile $image, User $actor): Certification
    {
        $certification = Certification::query()->create([
            'title' => $data->title,
            'issuing_organization' => $data->issuingOrganization,
            'issue_date' => $data->issueDate,
            'expiry_date' => $data->expiryDate,
            'credential_id' => $data->credentialId,
            'credential_url' => $data->credentialUrl,
            'image_path' => $image ? $this->storeImage($image) : null,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created certification \"{$certification->title}\"", $certification);

        return $certification;
    }

    public function update(Certification $certification, CertificationData $data, ?UploadedFile $image, User $actor): Certification
    {
        $certification->update([
            'title' => $data->title,
            'issuing_organization' => $data->issuingOrganization,
            'issue_date' => $data->issueDate,
            'expiry_date' => $data->expiryDate,
            'credential_id' => $data->credentialId,
            'credential_url' => $data->credentialUrl,
            'image_path' => $this->resolveImagePath($certification, $data, $image),
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated certification \"{$certification->title}\"", $certification);

        return $certification;
    }

    public function delete(Certification $certification, User $actor): void
    {
        $title = $certification->title;

        if ($certification->image_path) {
            Storage::disk(self::IMAGE_DISK)->delete($certification->image_path);
        }

        $certification->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted certification \"{$title}\"");
    }

    private function resolveImagePath(Certification $certification, CertificationData $data, ?UploadedFile $newImage): ?string
    {
        $currentPath = $certification->image_path;

        if ($newImage) {
            if ($currentPath) {
                Storage::disk(self::IMAGE_DISK)->delete($currentPath);
            }

            return $this->storeImage($newImage);
        }

        if ($data->removeImage && $currentPath) {
            Storage::disk(self::IMAGE_DISK)->delete($currentPath);

            return null;
        }

        return $currentPath;
    }

    private function storeImage(UploadedFile $file): string
    {
        return $file->store(self::IMAGE_DIRECTORY, self::IMAGE_DISK);
    }
}
