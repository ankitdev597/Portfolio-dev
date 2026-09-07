<?php

namespace App\Services;

use App\DTOs\ExperienceData;
use App\Models\Experience;
use App\Models\User;

class ExperienceService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(ExperienceData $data, User $actor): Experience
    {
        $experience = Experience::query()->create([
            'company_name' => $data->companyName,
            'role_title' => $data->roleTitle,
            'employment_type' => $data->employmentType,
            'location' => $data->location,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'is_current' => $data->isCurrent,
            'description' => $data->description,
            'display_order' => $data->displayOrder,
        ]);

        $experience->technologies()->sync($data->technologyIds);

        $this->activityLog->log($actor, 'created', "Created experience \"{$experience->role_title}\" at \"{$experience->company_name}\"", $experience);

        return $experience;
    }

    public function update(Experience $experience, ExperienceData $data, User $actor): Experience
    {
        $experience->update([
            'company_name' => $data->companyName,
            'role_title' => $data->roleTitle,
            'employment_type' => $data->employmentType,
            'location' => $data->location,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'is_current' => $data->isCurrent,
            'description' => $data->description,
            'display_order' => $data->displayOrder,
        ]);

        $experience->technologies()->sync($data->technologyIds);

        $this->activityLog->log($actor, 'updated', "Updated experience \"{$experience->role_title}\" at \"{$experience->company_name}\"", $experience);

        return $experience;
    }

    public function delete(Experience $experience, User $actor): void
    {
        $label = "{$experience->role_title} at {$experience->company_name}";
        $experience->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted experience \"{$label}\"");
    }
}
