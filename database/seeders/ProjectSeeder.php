<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Technology;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seeds exactly ONE project: the AI-Powered Hiring Sentiment Analysis
     * Platform explicitly named in the resume/spec (#15). Everything below
     * uses only what the spec states (OpenAI/LLM, WebSockets, real-time
     * chat, backend architecture, data persistence) - no invented metrics,
     * client names, or outcomes (spec #12/#38: never fabricate projects,
     * never misrepresent classification).
     *
     * classification is deliberately left as EXPERIMENT (draft, unpublished)
     * rather than assumed REAL/PERSONAL - Ankit should confirm the correct
     * classification and add full case-study detail from the admin CMS
     * before publishing (is_published stays false until then).
     */
    public function run(): void
    {
        $category = ProjectCategory::query()->where('slug', 'ai-llm-projects')->first();

        $project = Project::query()->updateOrCreate(
            ['slug' => 'ai-powered-hiring-sentiment-analysis-platform'],
            [
                'project_category_id' => $category?->id,
                'title' => 'AI-Powered Hiring Sentiment Analysis Platform',
                'short_description' => 'An AI-driven platform analyzing hiring/interview sentiment in real time using LLM integration.',
                'full_description' => 'Uses OpenAI/LLM integration alongside real-time, WebSocket-driven communication and persistent backend storage to analyze hiring sentiment. Full case-study detail (problem, architecture, results) to be completed from the admin CMS.',
                'classification' => 'experiment',
                'is_featured' => true,
                'is_published' => false,
                'display_order' => 0,
            ]
        );

        $techNames = ['OpenAI API', 'LLM Integration', 'WebSockets', 'Laravel', 'MySQL'];

        $technologyIds = Technology::query()->whereIn('name', $techNames)->pluck('id');

        $project->technologies()->syncWithoutDetaching($technologyIds);
    }
}
