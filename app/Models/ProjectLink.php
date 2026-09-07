<?php

namespace App\Models;

use App\Enums\ProjectLinkType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'label',
        'url',
        'type',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProjectLinkType::class,
            'display_order' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
