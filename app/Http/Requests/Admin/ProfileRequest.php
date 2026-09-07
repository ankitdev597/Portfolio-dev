<?php

namespace App\Http\Requests\Admin;

use App\Models\Profile;
use Illuminate\Foundation\Http\FormRequest;

/**
 * There is only ever one Profile row (the site owner's own bio) - no
 * store/index/destroy, just this one form covering create-if-missing and
 * update alike. Authorized via the class (not an instance) since
 * ContentPolicy::update() only checks the user's role, not per-row state.
 */
class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', Profile::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'headline' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:80'],
            'bio' => ['nullable', 'string', 'max:20000'],
            'short_bio' => ['nullable', 'string', 'max:1000'],
            'philosophy' => ['nullable', 'string', 'max:10000'],
            'location' => ['nullable', 'string', 'max:255'],
            'availability_status' => ['nullable', 'string', 'max:255'],
            // 4MB max, image types only - stored via ProfileService, never
            // touched directly by the controller.
            'avatar' => ['nullable', 'image', 'max:4096'],
            'remove_avatar' => ['nullable', 'boolean'],
            // 5MB max, PDF only.
            'resume' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'remove_resume' => ['nullable', 'boolean'],
        ];
    }
}
