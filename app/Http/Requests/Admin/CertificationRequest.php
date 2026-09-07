<?php

namespace App\Http\Requests\Admin;

use App\Models\Certification;
use Illuminate\Foundation\Http\FormRequest;

class CertificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Certification|null $certification */
        $certification = $this->route('certification');

        return $certification
            ? $this->user()?->can('update', $certification) ?? false
            : $this->user()?->can('create', Certification::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'issuing_organization' => ['required', 'string', 'max:255'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'credential_id' => ['nullable', 'string', 'max:255'],
            'credential_url' => ['nullable', 'url', 'max:2048'],
            // 2MB max, image types only - stored on the 'public' disk by
            // CertificationService (never handled directly by the
            // controller), same shape as ProjectService's thumbnail
            // handling.
            'image' => ['nullable', 'image', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
