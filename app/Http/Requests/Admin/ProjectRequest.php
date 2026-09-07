<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectClassification;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Project|null $project */
        $project = $this->route('project');

        return $project
            ? $this->user()?->can('update', $project) ?? false
            : $this->user()?->can('create', Project::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Project|null $project */
        $project = $this->route('project');

        return [
            'project_category_id' => ['nullable', 'integer', 'exists:project_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable', 'string', 'max:255', 'alpha_dash',
                Rule::unique('projects', 'slug')->ignore($project?->id),
            ],
            'short_description' => ['required', 'string', 'max:500'],
            'full_description' => ['nullable', 'string', 'max:20000'],
            'problem' => ['nullable', 'string', 'max:10000'],
            'solution' => ['nullable', 'string', 'max:10000'],
            'architecture' => ['nullable', 'string', 'max:10000'],
            'my_contribution' => ['nullable', 'string', 'max:10000'],
            'challenges' => ['nullable', 'string', 'max:10000'],
            'results' => ['nullable', 'string', 'max:10000'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'github_url' => ['nullable', 'url', 'max:2048'],
            'live_url' => ['nullable', 'url', 'max:2048'],
            'classification' => ['required', Rule::enum(ProjectClassification::class)],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            // 4MB max, image types only - stored on the 'public' disk by
            // ProjectService (never handled directly by the controller).
            'thumbnail' => ['nullable', 'image', 'max:4096'],
            'remove_thumbnail' => ['nullable', 'boolean'],
            'technology_ids' => ['nullable', 'array'],
            'technology_ids.*' => ['integer', 'exists:technologies,id'],
        ];
    }
}
