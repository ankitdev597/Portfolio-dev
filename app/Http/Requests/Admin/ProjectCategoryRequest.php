<?php

namespace App\Http\Requests\Admin;

use App\Models\ProjectCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ProjectCategory|null $projectCategory */
        $projectCategory = $this->route('projectCategory');

        return $projectCategory
            ? $this->user()?->can('update', $projectCategory) ?? false
            : $this->user()?->can('create', ProjectCategory::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var ProjectCategory|null $projectCategory */
        $projectCategory = $this->route('projectCategory');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255', 'alpha_dash',
                Rule::unique('project_categories', 'slug')->ignore($projectCategory?->id),
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
