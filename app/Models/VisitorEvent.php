<?php

namespace App\Models;

use App\Enums\VisitorEventType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_session_id',
        'event_type',
        'meta',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'event_type' => VisitorEventType::class,
            'meta' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(VisitorSession::class, 'visitor_session_id');
    }
}
