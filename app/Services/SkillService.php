<?php

namespace App\Services;

use App\DTOs\SkillData;
use App\Models\Skill;
use App\Models\User;

class SkillService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(SkillData $data, User $actor): Skill
    {
        $skill = Skill::query()->create([
            'skill_category_id' => $data->skillCategoryId,
            'name' => $data->name,
            'icon' => $data->icon,
            'proficiency' => $data->proficiency,
            'is_featured' => $data->isFeatured,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created skill \"{$skill->name}\"", $skill);

        return $skill;
    }

    public function update(Skill $skill, SkillData $data, User $actor): Skill
    {
        $skill->update([
            'skill_category_id' => $data->skillCategoryId,
            'name' => $data->name,
            'icon' => $data->icon,
            'proficiency' => $data->proficiency,
            'is_featured' => $data->isFeatured,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated skill \"{$skill->name}\"", $skill);

        return $skill;
    }

    public function delete(Skill $skill, User $actor): void
    {
        $name = $skill->name;
        $skill->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted skill \"{$name}\"");
    }
}
