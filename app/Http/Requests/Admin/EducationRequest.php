<?php

namespace App\Http\Requests\Admin;

use App\Models\Education;
use Illuminate\Foundation\Http\FormRequest;

class EducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Education|null $education */
        $education = $this->route('education');

        return $education
            ? $this->user()?->can('update', $education) ?? false
            : $this->user()?->can('create', Education::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'institution' => ['required', 'string', 'max:255'],
            'degree' => ['required', 'string', 'max:255'],
            'field_of_study' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'description' => ['nullable', 'string', 'max:5000'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
