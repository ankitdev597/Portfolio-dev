<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitorSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'session_uuid',
        'referrer',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'landing_page',
        'device_type',
        'browser',
        'os',
        'ip_hash',
        'country',
        'region',
        'started_at',
        'ended_at',
        'duration_seconds',
        'is_online',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'duration_seconds' => 'integer',
            'is_online' => 'boolean',
        ];
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }

    public function pageViews(): HasMany
    {
        return $this->hasMany(PageView::class)->orderBy('viewed_at');
    }

    public function events(): HasMany
    {
        return $this->hasMany(VisitorEvent::class)->orderBy('occurred_at');
    }

    public function scopeOnline(Builder $query): Builder
    {
        return $query->where('is_online', true)
            ->where('last_activity_at', '>=', now()->subMinutes(5));
    }
}
