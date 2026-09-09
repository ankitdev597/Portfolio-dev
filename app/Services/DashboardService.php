<?php

namespace App\Services;

use App\Enums\ContactMessageStatus;
use App\Models\ActivityLog;
use App\Models\Certification;
use App\Models\ContactMessage;
use App\Models\Experience;
use App\Models\PageView;
use App\Models\Project;
use App\Models\Resume;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Technology;
use App\Models\Visitor;
use App\Models\VisitorSession;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Aggregates every number the admin Dashboard shows. Deliberately one
 * Service (not scattered `Model::count()` calls in the Controller) so the
 * Controller stays thin and every query used by the dashboard has one
 * place to optimize/cache later if it ever gets slow.
 */
class DashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function stats(): array
    {
        $today = Carbon::today();

        return [
            'projects' => [
                'total' => Project::query()->count(),
                'published' => Project::query()->published()->count(),
                'featured' => Project::query()->featured()->count(),
            ],
            'skills' => Skill::query()->count(),
            'technologies' => Technology::query()->count(),
            'services' => Service::query()->count(),
            'experience' => Experience::query()->count(),
            'certifications' => Certification::query()->count(),
            'resumes' => Resume::query()->count(),
            'visitors' => [
                'total' => Visitor::query()->count(),
                'today' => Visitor::query()->whereDate('first_visit_at', $today)->count(),
                'online_now' => VisitorSession::query()->online()->count(),
                'returning' => Visitor::query()->where('is_returning', true)->count(),
            ],
            'page_views' => [
                'total' => PageView::query()->count(),
                'today' => PageView::query()->whereDate('viewed_at', $today)->count(),
            ],
            'messages' => [
                'total' => ContactMessage::query()->count(),
                'new' => ContactMessage::query()->where('status', ContactMessageStatus::NEW)->count(),
            ],
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function recentActivity(int $limit = 8): Collection
    {
        return ActivityLog::query()
            ->with('user:id,name')
            ->latest('id')
            ->limit($limit)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user_name' => $log->user?->name,
                'created_at' => $log->created_at?->toIso8601String(),
            ]);
    }
}
