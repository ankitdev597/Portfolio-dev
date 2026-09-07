<?php

namespace App\Services;

use App\DTOs\SkillCategoryData;
use App\Models\SkillCategory;
use App\Models\User;
use Illuminate\Support\Str;

class SkillCategoryService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(SkillCategoryData $data, User $actor): SkillCategory
    {
        $category = SkillCategory::query()->create([
            'name' => $data->name,
            'slug' => Str::slug($data->slug ?: $data->name),
            'icon' => $data->icon,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created skill category \"{$category->name}\"", $category);

        return $category;
    }

    public function update(SkillCategory $category, SkillCategoryData $data, User $actor): SkillCategory
    {
        $category->update([
            'name' => $data->name,
            'slug' => Str::slug($data->slug ?: $data->name),
            'icon' => $data->icon,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated skill category \"{$category->name}\"", $category);

        return $category;
    }

    /**
     * Deleting a category cascades to its skills at the database level
     * (skills.skill_category_id is cascadeOnDelete) - surfaced here so the
     * controller can warn the admin before calling it.
     */
    public function delete(SkillCategory $category, User $actor): void
    {
        $name = $category->name;
        $category->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted skill category \"{$name}\" (and its skills)");
    }
}
