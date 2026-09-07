<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/**
 * Single source of truth for reading/writing admin-configurable site
 * settings (site name, contact email, WhatsApp number + default message,
 * theme tokens, integrations, ...). Every value is cached so the public
 * site and the Inertia shared-props layer never hit the database per
 * request; the cache is busted automatically on write.
 *
 * Nothing in the frontend should ever hard-code a value this service can
 * provide (see project rule: "No hardcoded content").
 */
class SiteSettingService
{
    private const CACHE_KEY = 'site_settings.all';

    private const CACHE_TTL_SECONDS = 3600;

    /**
     * @return array<string, mixed> key => casted value, for every setting.
     */
    public function all(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL_SECONDS, function () {
            return SiteSetting::query()
                ->get()
                ->mapWithKeys(fn (SiteSetting $setting) => [$setting->key => $setting->casted_value])
                ->all();
        });
    }

    /**
     * Only the settings safe to expose to the public website (is_public = true).
     * Shared into every Inertia response via HandleInertiaRequests.
     *
     * @return array<string, mixed>
     */
    public function publicSettings(): array
    {
        return Cache::remember(self::CACHE_KEY.'.public', self::CACHE_TTL_SECONDS, function () {
            return SiteSetting::query()
                ->where('is_public', true)
                ->get()
                ->mapWithKeys(fn (SiteSetting $setting) => [$setting->key => $setting->casted_value])
                ->all();
        });
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->all()[$key] ?? $default;
    }

    public function set(string $key, mixed $value, ?string $type = null, ?string $group = null, ?bool $isPublic = null): SiteSetting
    {
        $setting = SiteSetting::query()->firstOrNew(['key' => $key]);

        $setting->value = is_array($value) ? json_encode($value) : (string) $value;

        if ($type !== null) {
            $setting->type = $type;
        }

        if ($group !== null) {
            $setting->group = $group;
        }

        if ($isPublic !== null) {
            $setting->is_public = $isPublic;
        }

        if (! $setting->exists) {
            $setting->type ??= 'string';
            $setting->group ??= 'general';
            $setting->is_public ??= true;
        }

        $setting->save();

        $this->flush();

        return $setting;
    }

    public function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget(self::CACHE_KEY.'.public');
    }

    /**
     * Stores an uploaded file (favicon/logo/profile image) on the 'public'
     * disk under 'site' and writes its resulting path as an `image`-typed
     * setting, deleting whatever file the key previously pointed at - same
     * "Service owns the file lifecycle" shape as Project/Certification/
     * Profile, just against the key-value store instead of a model column.
     */
    public function setImage(string $key, UploadedFile $file, string $group): SiteSetting
    {
        $this->deleteImageIfExists($key);

        $path = $file->store('site', 'public');

        return $this->set($key, $path, 'image', $group, true);
    }

    public function removeImage(string $key, string $group): SiteSetting
    {
        $this->deleteImageIfExists($key);

        return $this->set($key, '', 'image', $group, true);
    }

    private function deleteImageIfExists(string $key): void
    {
        $currentPath = $this->get($key);

        if (! empty($currentPath)) {
            Storage::disk('public')->delete((string) $currentPath);
        }
    }

    /**
     * Resolves an `image`-typed setting's stored relative path to a
     * ready-to-use public URL, or null when unset - the same translation
     * every other file-backed accessor in this app does (Project
     * thumbnail_url, Certification image_url, Profile avatar_url).
     */
    public function imageUrl(string $key): ?string
    {
        $path = $this->get($key);

        return empty($path) ? null : Storage::disk('public')->url((string) $path);
    }

    /**
     * Builds a wa.me deep link from the admin-configured WhatsApp number and
     * default message, so the frontend never hard-codes either (spec #18).
     */
    public function whatsappLink(): ?string
    {
        $number = $this->get('whatsapp_number');

        if (empty($number)) {
            return null;
        }

        $digitsOnly = preg_replace('/\D+/', '', (string) $number);
        $message = (string) $this->get('whatsapp_default_message', '');

        return 'https://wa.me/'.$digitsOnly.($message !== '' ? '?text='.rawurlencode($message) : '');
    }
}
