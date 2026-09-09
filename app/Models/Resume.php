<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Resume extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_title',
        'label',
        'file_path',
        'file_original_name',
        'is_active',
        'display_order',
    ];

    /**
     * Same "computed accessor for an uploaded file's public URL" pattern as
     * Certification::imageUrl() / Profile::resumeUrl() - the frontend never
     * needs to know the disk/path scheme, just a ready-to-use URL.
     */
    protected $appends = ['file_url'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->file_path ? Storage::disk('public')->url($this->file_path) : null,
        );
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('display_order');
    }
}
