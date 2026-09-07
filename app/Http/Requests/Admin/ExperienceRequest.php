<?php

namespace App\Http\Requests\Admin;

use App\Enums\EmploymentType;
use App\Models\Experience;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Experience|null $experience */
        $experience = $this->route('experience');

        return $experience
            ? $this->user()?->can('update', $experience) ?? false
            : $this->user()?->can('create', Experience::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'role_title' => ['required', 'string', 'max:255'],
            'employment_type' => ['required', Rule::enum(EmploymentType::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            // Not "after start_date" - a same-month start/end apprenticeship
            // is legitimate; "after_or_equal" would still be too strict for
            // that, so only bar an end date earlier than the start.
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:10000'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
            'technology_ids' => ['nullable', 'array'],
            'technology_ids.*' => ['integer', 'exists:technologies,id'],
        ];
    }
}
