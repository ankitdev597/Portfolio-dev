<?php

namespace App\Http\Requests\Admin;

use App\Models\Resume;
use Illuminate\Foundation\Http\FormRequest;

class ResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Resume|null $resume */
        $resume = $this->route('resume');

        return $resume
            ? $this->user()?->can('update', $resume) ?? false
            : $this->user()?->can('create', Resume::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role_title' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
            // 5MB max, PDF only - required on create (POST), optional on
            // update (PUT/PATCH: omitting it just keeps the current file),
            // same shape as Certification's image upload.
            'file' => [$this->isMethod('post') ? 'required' : 'nullable', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }
}
