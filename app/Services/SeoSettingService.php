<?php

namespace App\Services;

use App\DTOs\SeoSettingData;
use App\Models\SeoSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Same "file uploads go through a Service" shape as
 * ProjectService/CertificationService, for each page's og:image.
 */
class SeoSettingService
{
    private const IMAGE_DISK = 'public';

    private const IMAGE_DIRECTORY = 'seo';

    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(SeoSettingData $data, ?UploadedFile $ogImage, User $actor): SeoSetting
    {
        $seoSetting = SeoSetting::query()->create([
            'page_key' => $data->pageKey,
            'title' => $data->title,
            'description' => $data->description,
            'canonical_url' => $data->canonicalUrl,
            'keywords' => $data->keywords,
            'og_image_path' => $ogImage ? $this->storeImage($ogImage) : null,
        ]);

        $this->activityLog->log($actor, 'created', "Created SEO settings for page \"{$seoSetting->page_key}\"", $seoSetting);

        return $seoSetting;
    }

    public function update(SeoSetting $seoSetting, SeoSettingData $data, ?UploadedFile $ogImage, User $actor): SeoSetting
    {
        $seoSetting->update([
            'page_key' => $data->pageKey,
            'title' => $data->title,
            'description' => $data->description,
            'canonical_url' => $data->canonicalUrl,
            'keywords' => $data->keywords,
            'og_image_path' => $this->resolveImagePath($seoSetting, $data, $ogImage),
        ]);

        $this->activityLog->log($actor, 'updated', "Updated SEO settings for page \"{$seoSetting->page_key}\"", $seoSetting);

        return $seoSetting;
    }

    public function delete(SeoSetting $seoSetting, User $actor): void
    {
        $pageKey = $seoSetting->page_key;

        if ($seoSetting->og_image_path) {
            Storage::disk(self::IMAGE_DISK)->delete($seoSetting->og_image_path);
        }

        $seoSetting->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted SEO settings for page \"{$pageKey}\"");
    }

    private function resolveImagePath(SeoSetting $seoSetting, SeoSettingData $data, ?UploadedFile $newImage): ?string
    {
        $currentPath = $seoSetting->og_image_path;

        if ($newImage) {
            if ($currentPath) {
                Storage::disk(self::IMAGE_DISK)->delete($currentPath);
            }

            return $this->storeImage($newImage);
        }

        if ($data->removeOgImage && $currentPath) {
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
