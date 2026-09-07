<?php

namespace App\Http\Requests\Admin;

use App\Enums\TechnologyCategory;
use App\Models\Technology;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * Covers both create and update for Technology - the only rule that differs
 * between the two is the slug's uniqueness ignore-id, handled below via the
 * route-bound model. Keeps one file per resource instead of a near-duplicate
 * Store/Update pair (project DRY rule).
 */
class TechnologyRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Technology|null $technology */
        $technology = $this->route('technology');

        return $technology
            ? $this->user()?->can('update', $technology) ?? false
            : $this->user()?->can('create', Technology::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Technology|null $technology */
        $technology = $this->route('technology');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255', 'alpha_dash',
                Rule::unique('technologies', 'slug')->ignore($technology?->id),
            ],
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:16'],
            'category' => ['required', new Enum(TechnologyCategory::class)],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
