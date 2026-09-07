<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_session_id',
        'url',
        'title',
        'viewed_at',
        'duration_seconds',
    ];

    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
            'duration_seconds' => 'integer',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(VisitorSession::class, 'visitor_session_id');
    }
}
