<?php

namespace App\Http\Requests\Admin;

use App\Models\SeoSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SeoSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', SeoSetting::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var SeoSetting|null $seoSetting */
        $seoSetting = $this->route('seoSetting');

        return [
            'page_key' => [
                'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique('seo_settings', 'page_key')->ignore($seoSetting?->id),
            ],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'url', 'max:2048'],
            'keywords' => ['nullable', 'string', 'max:500'],
            // 2MB max, image types only - stored via SeoSettingService,
            // never touched directly by the controller.
            'og_image' => ['nullable', 'image', 'max:2048'],
            'remove_og_image' => ['nullable', 'boolean'],
        ];
    }
}
