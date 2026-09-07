<?php

namespace App\Services;

use App\DTOs\ServiceData;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Str;

class ServiceService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(ServiceData $data, User $actor): Service
    {
        $service = Service::query()->create([
            'title' => $data->title,
            'slug' => $this->resolveSlug($data->slug, $data->title),
            'short_description' => $data->shortDescription,
            'description' => $data->description,
            'icon' => $data->icon,
            'is_active' => $data->isActive,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created service \"{$service->title}\"", $service);

        return $service;
    }

    public function update(Service $service, ServiceData $data, User $actor): Service
    {
        $service->update([
            'title' => $data->title,
            'slug' => $this->resolveSlug($data->slug, $data->title),
            'short_description' => $data->shortDescription,
            'description' => $data->description,
            'icon' => $data->icon,
            'is_active' => $data->isActive,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated service \"{$service->title}\"", $service);

        return $service;
    }

    public function delete(Service $service, User $actor): void
    {
        $title = $service->title;
        $service->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted service \"{$title}\"");
    }

    private function resolveSlug(?string $slug, string $title): string
    {
        return Str::slug($slug ?: $title);
    }
}
