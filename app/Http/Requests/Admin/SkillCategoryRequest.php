<?php

namespace App\Http\Requests\Admin;

use App\Models\SkillCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SkillCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var SkillCategory|null $skillCategory */
        $skillCategory = $this->route('skillCategory');

        return $skillCategory
            ? $this->user()?->can('update', $skillCategory) ?? false
            : $this->user()?->can('create', SkillCategory::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var SkillCategory|null $skillCategory */
        $skillCategory = $this->route('skillCategory');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255', 'alpha_dash',
                Rule::unique('skill_categories', 'slug')->ignore($skillCategory?->id),
            ],
            'icon' => ['nullable', 'string', 'max:255'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
