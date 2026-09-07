<?php

namespace App\Models;

use App\Enums\ContactMessageStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'name',
        'email',
        'subject',
        'message',
        'ip_hash',
        'user_agent',
        'status',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContactMessageStatus::class,
            'read_at' => 'datetime',
        ];
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }

    public function lead(): HasOne
    {
        return $this->hasOne(Lead::class);
    }
}
