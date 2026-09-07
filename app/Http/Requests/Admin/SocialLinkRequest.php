<?php

namespace App\Http\Requests\Admin;

use App\Models\SocialLink;
use Illuminate\Foundation\Http\FormRequest;

class SocialLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var SocialLink|null $socialLink */
        $socialLink = $this->route('socialLink');

        return $socialLink
            ? $this->user()?->can('update', $socialLink) ?? false
            : $this->user()?->can('create', SocialLink::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Free-text, not a DB enum (see the migration's own comment) -
            // github | linkedin | email | twitter | other are the expected
            // values but nothing stops a new platform being added later
            // without a migration.
            'platform' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
