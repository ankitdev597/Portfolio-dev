<?php

namespace App\Http\Requests\Admin;

use App\Models\Skill;
use Illuminate\Foundation\Http\FormRequest;

class SkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Skill|null $skill */
        $skill = $this->route('skill');

        return $skill
            ? $this->user()?->can('update', $skill) ?? false
            : $this->user()?->can('create', Skill::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'skill_category_id' => ['required', 'integer', 'exists:skill_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'proficiency' => ['nullable', 'integer', 'min:0', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
