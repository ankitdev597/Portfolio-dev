<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request as RequestFacade;

/**
 * Writes rows to activity_logs (spec #49: "who changed what"). Controllers
 * and services call this instead of writing to the model directly, so the
 * logging shape stays consistent everywhere it's used.
 *
 * IP addresses are stored hashed (sha256), never in plain text, in line
 * with the project's data-minimisation rule for visitor/PII data.
 */
class ActivityLogService
{
    public function log(?User $user, string $action, string $description, ?Model $subject = null, array $properties = []): ActivityLog
    {
        return ActivityLog::query()->create([
            'user_id' => $user?->id,
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties,
            'ip_hash' => $this->hashIp(RequestFacade::ip()),
        ]);
    }

    private function hashIp(?string $ip): ?string
    {
        return $ip ? hash('sha256', $ip) : null;
    }
}
