<?php

namespace App\Models;

use App\Enums\ProjectClassification;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_category_id',
        'title',
        'slug',
        'short_description',
        'full_description',
        'problem',
        'solution',
        'architecture',
        'my_contribution',
        'challenges',
        'results',
        'thumbnail_path',
        'hero_image_path',
        'video_url',
        'github_url',
        'live_url',
        'classification',
        'is_featured',
        'display_order',
        'is_published',
        'published_at',
        'seo_title',
        'seo_description',
        'og_image_path',
    ];

    /**
     * Same reasoning as Profile::avatarUrl() - `thumbnail_path` is a raw
     * disk path, never directly usable as an <img src>. Computed once here
     * instead of in every controller/frontend spot that renders a project
     * thumbnail (admin list, admin edit form, public project grid).
     */
    protected $appends = ['thumbnail_url'];

    protected function casts(): array
    {
        return [
            'classification' => ProjectClassification::class,
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'views_count' => 'integer',
            'display_order' => 'integer',
        ];
    }

    protected function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->thumbnail_path ? Storage::disk('public')->url($this->thumbnail_path) : null,
        );
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technologies');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('display_order');
    }

    public function features(): HasMany
    {
        return $this->hasMany(ProjectFeature::class)->orderBy('display_order');
    }

    public function links(): HasMany
    {
        return $this->hasMany(ProjectLink::class)->orderBy('display_order');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->whereNotNull('published_at');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('display_order')->orderByDesc('published_at');
    }
}
