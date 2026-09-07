<?php

namespace App\Models;

use App\Enums\EmploymentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'role_title',
        'employment_type',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'company_logo_path',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'employment_type' => EmploymentType::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'experience_technology');
    }

    public function scopeOrdered($query)
    {
        return $query->orderByDesc('start_date');
    }
}
