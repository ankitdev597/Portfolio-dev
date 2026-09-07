<?php

namespace App\Services;

use App\DTOs\EducationData;
use App\Models\Education;
use App\Models\User;

class EducationService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(EducationData $data, User $actor): Education
    {
        $education = Education::query()->create([
            'institution' => $data->institution,
            'degree' => $data->degree,
            'field_of_study' => $data->fieldOfStudy,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'description' => $data->description,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created education \"{$education->degree}\" at \"{$education->institution}\"", $education);

        return $education;
    }

    public function update(Education $education, EducationData $data, User $actor): Education
    {
        $education->update([
            'institution' => $data->institution,
            'degree' => $data->degree,
            'field_of_study' => $data->fieldOfStudy,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'description' => $data->description,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated education \"{$education->degree}\" at \"{$education->institution}\"", $education);

        return $education;
    }

    public function delete(Education $education, User $actor): void
    {
        $label = "{$education->degree} at {$education->institution}";
        $education->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted education \"{$label}\"");
    }
}
