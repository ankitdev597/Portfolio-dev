<?php

namespace App\Services;

use App\DTOs\ProjectCategoryData;
use App\Models\ProjectCategory;
use App\Models\User;
use Illuminate\Support\Str;

class ProjectCategoryService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(ProjectCategoryData $data, User $actor): ProjectCategory
    {
        $category = ProjectCategory::query()->create([
            'name' => $data->name,
            'slug' => Str::slug($data->slug ?: $data->name),
            'description' => $data->description,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created project category \"{$category->name}\"", $category);

        return $category;
    }

    public function update(ProjectCategory $category, ProjectCategoryData $data, User $actor): ProjectCategory
    {
        $category->update([
            'name' => $data->name,
            'slug' => Str::slug($data->slug ?: $data->name),
            'description' => $data->description,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated project category \"{$category->name}\"", $category);

        return $category;
    }

    public function delete(ProjectCategory $category, User $actor): void
    {
        $name = $category->name;
        $category->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted project category \"{$name}\"");
    }
}
