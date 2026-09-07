<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'first_visit_at',
        'last_visit_at',
        'visit_count',
        'is_returning',
        'device_type',
        'browser',
        'os',
        'country',
        'region',
        'has_consented',
    ];

    protected function casts(): array
    {
        return [
            'first_visit_at' => 'datetime',
            'last_visit_at' => 'datetime',
            'visit_count' => 'integer',
            'is_returning' => 'boolean',
            'has_consented' => 'boolean',
        ];
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(VisitorSession::class);
    }

    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }
}
