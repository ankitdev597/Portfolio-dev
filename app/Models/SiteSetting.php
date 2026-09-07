<?php

namespace App\Models;

use App\Enums\SiteSettingGroup;
use App\Enums\SiteSettingType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'type' => SiteSettingType::class,
            'group' => SiteSettingGroup::class,
            'is_public' => 'boolean',
        ];
    }

    /**
     * Return the raw `value` column cast to its declared logical type
     * (boolean/integer/json), rather than the plain string it is stored as.
     * Used by App\Services\SiteSettingService so callers never juggle casts.
     */
    public function getCastedValueAttribute(): mixed
    {
        return match ($this->type) {
            SiteSettingType::BOOLEAN => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            SiteSettingType::INTEGER => (int) $this->value,
            SiteSettingType::JSON => json_decode((string) $this->value, true),
            default => $this->value,
        };
    }
}
