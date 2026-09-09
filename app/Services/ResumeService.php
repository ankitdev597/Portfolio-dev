<?php

namespace App\Services;

use App\DTOs\ResumeData;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Same "file uploads go through a Service, never the controller" shape as
 * CertificationService's image handling - store-on-create,
 * replace-and-delete-old-on-update, behind Storage::disk('public').
 */
class ResumeService
{
    private const DISK = 'public';

    private const DIRECTORY = 'resumes';

    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(ResumeData $data, UploadedFile $file, User $actor): Resume
    {
        $resume = Resume::query()->create([
            'role_title' => $data->roleTitle,
            'label' => $data->label,
            'file_path' => $this->storeFile($file),
            'file_original_name' => $file->getClientOriginalName(),
            'is_active' => $data->isActive,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created resume \"{$resume->role_title}\"", $resume);

        return $resume;
    }

    public function update(Resume $resume, ResumeData $data, ?UploadedFile $file, User $actor): Resume
    {
        $resume->update([
            'role_title' => $data->roleTitle,
            'label' => $data->label,
            'file_path' => $this->resolveFilePath($resume, $file),
            'file_original_name' => $file ? $file->getClientOriginalName() : $resume->file_original_name,
            'is_active' => $data->isActive,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated resume \"{$resume->role_title}\"", $resume);

        return $resume;
    }

    public function delete(Resume $resume, User $actor): void
    {
        $roleTitle = $resume->role_title;

        Storage::disk(self::DISK)->delete($resume->file_path);
        $resume->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted resume \"{$roleTitle}\"");
    }

    private function resolveFilePath(Resume $resume, ?UploadedFile $newFile): string
    {
        if (! $newFile) {
            return $resume->file_path;
        }

        Storage::disk(self::DISK)->delete($resume->file_path);

        return $this->storeFile($newFile);
    }

    private function storeFile(UploadedFile $file): string
    {
        return $file->store(self::DIRECTORY, self::DISK);
    }
}
