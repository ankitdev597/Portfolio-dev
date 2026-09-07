<?php

namespace App\Services;

use App\DTOs\SocialLinkData;
use App\Models\SocialLink;
use App\Models\User;

class SocialLinkService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function create(SocialLinkData $data, User $actor): SocialLink
    {
        $socialLink = SocialLink::query()->create([
            'platform' => $data->platform,
            'label' => $data->label,
            'url' => $data->url,
            'icon' => $data->icon,
            'is_active' => $data->isActive,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'created', "Created social link \"{$socialLink->platform}\"", $socialLink);

        return $socialLink;
    }

    public function update(SocialLink $socialLink, SocialLinkData $data, User $actor): SocialLink
    {
        $socialLink->update([
            'platform' => $data->platform,
            'label' => $data->label,
            'url' => $data->url,
            'icon' => $data->icon,
            'is_active' => $data->isActive,
            'display_order' => $data->displayOrder,
        ]);

        $this->activityLog->log($actor, 'updated', "Updated social link \"{$socialLink->platform}\"", $socialLink);

        return $socialLink;
    }

    public function delete(SocialLink $socialLink, User $actor): void
    {
        $platform = $socialLink->platform;
        $socialLink->delete();

        $this->activityLog->log($actor, 'deleted', "Deleted social link \"{$platform}\"");
    }
}
