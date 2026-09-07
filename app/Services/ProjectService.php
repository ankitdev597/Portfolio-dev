<?php

namespace App\Services;

use App\DTOs\ProjectData;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * All Project write paths (create/update/delete/publish/feature toggles)
 * go through here - never `Project::create()`/`->update()` directly from a
 * controller - so slug generation, thumbnail file lifecycle, the
 * technologies pivot sync, and activity logging can never be forgotten on
 * one code path but not another (the same rule Batch 1's services follow).
 */
class ProjectService
{
    private const THUMBNAIL_DISK = 'public';

    private const THUMBNAIL_DIRECTORY = 'projects/thumbnails';

    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(ProjectData $data, ?UploadedFile $thumbnail, User $actor): Project
    {
        $project = Project::query()->create([
            'project_category_id' => $data->projectCategoryId,
            'title' => $data->title,
            'slug' => $this->resolveSlug($data->slug, $data->title),
            'short_description' => $data->shortDescription,
            'full_description' => $data->fullDescription,
            'problem' => $data->problem,
            'solution' => $data->solution,
            'architecture' => $data->architecture,
            'my_contribution' => $data->myContribution,
            'challenges' => $data->challenges,
            'results' => $data->results,
            'thumbnail_path' => $thumbnail ? $this->storeThumbnail($thumbnail) : null,
            'video_url' => $data->videoUrl,
            'github_url' => $data->githubUrl,
            'live_url' => $data->liveUrl,
            'classification' => $data->classification,
            'is_featured' => $data->isFeatured,
            'display_order' => $data->displayOrder,
            'is_published' => $data->isPublished,
            'published_at' => $data->isPublished ? Date::now() : null,
            'seo_title' => $data->seoTitle,
            'seo_description' => $data->seoDescription,
        ]);

        $project->technologies()->sync($data->technologyIds);

        $this->activityLog->log($actor, 'created', "Created project \"{$project->title}\"", $project);

        return $project;
    }

    public function update(Project $project, ProjectData $data, ?UploadedFile $thumbnail, User $actor): Project
    {
        $thumbnailPath = $this->resolveThumbnailPath($project, $data, $thumbnail);

        // Once a project has ever been published, keep the original
        // published_at (so republishing doesn't make it look brand new in
        // a chronological feed) - only set it the FIRST time is_published
        // flips to true. scopePublished() requires both flags, so this is
        // also what makes "publish" actually take effect immediately.
        $publishedAt = $data->isPublished
            ? ($project->published_at ?? Date::now())
            : $project->published_at;

        $project->update([
            'project_category_id' => $data->projectCategoryId,
            'title' => $data->title,
            'slug' => $this->resolveSlug($data->slug, $data->title),
            'short_description' => $data->shortDescription,
            'full_description' => $data->fullDescription,
            'problem' => $data->problem,
            'solution' => $data->solution,
            'architecture' => $data->architecture,
            'my_contribution' => $data->myContribution,
            'challenges' => $data->challenges,
            'results' => $data->results,
            'thumbnail_path' => $thumbnailPath,
            'video_url' => $data->videoUrl,
            'github_url' => $data->githubUrl,
            'live_url' => $data->liveUrl,
            'classification' => $data->classification,
            'is_featured' => $data->isFeatured,
            'display_order' => $data->displayOrder,
            'is_published' => $data->isPublished,
            'published_at' => $publishedAt,
            'seo_title' => $data->seoTitle,
            'seo_description' => $data->seoDescription,
        ]);

        $project->technologies()->sync($data->technologyIds);

        $this->activityLog->log($actor, 'updated', "Updated project \"{$project->title}\"", $project);

        return $project;
    }

    public function delete(Project $project, User $actor): void
    {
        $title = $project->title;

        // Soft delete (Project uses SoftDeletes) - the thumbnail file is
        // deliberately left on disk in case the project is restored later;
        // there's no restore UI yet, but destroying the file here would
        // make that restore lossy for no benefit.
        $project->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted project \"{$title}\"");
    }

    public function togglePublished(Project $project, User $actor): Project
    {
        $isPublished = ! $project->is_published;

        $project->update([
            'is_published' => $isPublished,
            'published_at' => $isPublished ? ($project->published_at ?? Date::now()) : $project->published_at,
        ]);

        $this->activityLog->log(
            $actor,
            'updated',
            ($isPublished ? 'Published' : 'Unpublished')." project \"{$project->title}\"",
            $project,
        );

        return $project;
    }

    public function toggleFeatured(Project $project, User $actor): Project
    {
        $project->update(['is_featured' => ! $project->is_featured]);

        $this->activityLog->log(
            $actor,
            'updated',
            ($project->is_featured ? 'Featured' : 'Unfeatured')." project \"{$project->title}\"",
            $project,
        );

        return $project;
    }

    private function resolveThumbnailPath(Project $project, ProjectData $data, ?UploadedFile $newThumbnail): ?string
    {
        $currentPath = $project->thumbnail_path;

        if ($newThumbnail) {
            if ($currentPath) {
                Storage::disk(self::THUMBNAIL_DISK)->delete($currentPath);
            }

            return $this->storeThumbnail($newThumbnail);
        }

        if ($data->removeThumbnail && $currentPath) {
            Storage::disk(self::THUMBNAIL_DISK)->delete($currentPath);

            return null;
        }

        return $currentPath;
    }

    private function storeThumbnail(UploadedFile $file): string
    {
        return $file->store(self::THUMBNAIL_DIRECTORY, self::THUMBNAIL_DISK);
    }

    private function resolveSlug(?string $slug, string $title): string
    {
        return Str::slug($slug ?: $title);
    }
}
