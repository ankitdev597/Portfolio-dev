<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Certification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'issuing_organization',
        'issue_date',
        'expiry_date',
        'credential_id',
        'credential_url',
        'image_path',
        'display_order',
    ];

    /**
     * Same "computed accessor for an uploaded file's public URL" pattern as
     * Profile::avatarUrl() / Project::thumbnailUrl() - the frontend never
     * needs to know the disk/path scheme, just a ready-to-use URL or null.
     */
    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiry_date' => 'date',
            'display_order' => 'integer',
        ];
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image_path ? Storage::disk('public')->url($this->image_path) : null,
        );
    }
}
