<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'headline',
        'tagline',
        'years_experience',
        'bio',
        'short_bio',
        'philosophy',
        'avatar_path',
        'resume_path',
        'resume_original_name',
        'location',
        'availability_status',
    ];

    /**
     * `avatar_path` on its own is just a relative disk path (e.g.
     * "avatars/xyz.jpg") - never usable directly as an <img src>. Appending
     * this computed URL keeps that translation out of the controller/
     * frontend (spec: business logic belongs off the controller) and out
     * of every place that ever needs to render the avatar.
     */
    protected $appends = ['avatar_url', 'resume_url'];

    protected function casts(): array
    {
        return [
            'years_experience' => 'integer',
        ];
    }

    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null,
        );
    }

    protected function resumeUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->resume_path ? Storage::disk('public')->url($this->resume_path) : null,
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
