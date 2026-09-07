<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SeoSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_key',
        'title',
        'description',
        'og_image_path',
        'canonical_url',
        'keywords',
    ];

    /**
     * Same computed-accessor pattern as Project::thumbnailUrl() /
     * Certification::imageUrl() - a ready-to-use URL for the og:image, or
     * null when unset.
     */
    protected $appends = ['og_image_url'];

    protected function ogImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->og_image_path ? Storage::disk('public')->url($this->og_image_path) : null,
        );
    }
}
