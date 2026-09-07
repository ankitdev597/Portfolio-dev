<?php

namespace App\Services;

use App\DTOs\TechnologyData;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * All Technology write paths go through here (never `Technology::create()`
 * directly from a controller) so slug generation and activity logging can
 * never be forgotten on one code path but not another.
 */
class TechnologyService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(TechnologyData $data, User $actor): Technology
    {
        $technology = Technology::query()->create([
            'name' => $data->name,
            'slug' => $this->resolveSlug($data->slug, $data->name),
            'icon' => $data->icon,
            'color' => $data->color,
            'category' => $data->category,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created technology \"{$technology->name}\"", $technology);

        return $technology;
    }

    public function update(Technology $technology, TechnologyData $data, User $actor): Technology
    {
        $technology->update([
            'name' => $data->name,
            'slug' => $this->resolveSlug($data->slug, $data->name),
            'icon' => $data->icon,
            'color' => $data->color,
            'category' => $data->category,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated technology \"{$technology->name}\"", $technology);

        return $technology;
    }

    public function delete(Technology $technology, User $actor): void
    {
        $name = $technology->name;
        $technology->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted technology \"{$name}\"");
    }

    private function resolveSlug(?string $slug, string $name): string
    {
        return Str::slug($slug ?: $name);
    }
}
