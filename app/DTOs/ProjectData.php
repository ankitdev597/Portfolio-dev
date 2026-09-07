<?php

namespace App\DTOs;

final readonly class ProjectData
{
    /**
     * @param  int[]  $technologyIds
     */
    public function __construct(
        public ?int $projectCategoryId,
        public string $title,
        public ?string $slug,
        public string $shortDescription,
        public ?string $fullDescription,
        public ?string $problem,
        public ?string $solution,
        public ?string $architecture,
        public ?string $myContribution,
        public ?string $challenges,
        public ?string $results,
        public ?string $videoUrl,
        public ?string $githubUrl,
        public ?string $liveUrl,
        public string $classification,
        public bool $isFeatured,
        public bool $isPublished,
        public int $displayOrder,
        public ?string $seoTitle,
        public ?string $seoDescription,
        public bool $removeThumbnail,
        public array $technologyIds,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            projectCategoryId: isset($validated['project_category_id']) ? (int) $validated['project_category_id'] : null,
            title: $validated['title'],
            slug: $validated['slug'] ?? null,
            shortDescription: $validated['short_description'],
            fullDescription: $validated['full_description'] ?? null,
            problem: $validated['problem'] ?? null,
            solution: $validated['solution'] ?? null,
            architecture: $validated['architecture'] ?? null,
            myContribution: $validated['my_contribution'] ?? null,
            challenges: $validated['challenges'] ?? null,
            results: $validated['results'] ?? null,
            videoUrl: $validated['video_url'] ?? null,
            githubUrl: $validated['github_url'] ?? null,
            liveUrl: $validated['live_url'] ?? null,
            classification: $validated['classification'],
            isFeatured: (bool) ($validated['is_featured'] ?? false),
            isPublished: (bool) ($validated['is_published'] ?? false),
            displayOrder: (int) ($validated['display_order'] ?? 0),
            seoTitle: $validated['seo_title'] ?? null,
            seoDescription: $validated['seo_description'] ?? null,
            removeThumbnail: (bool) ($validated['remove_thumbnail'] ?? false),
            technologyIds: array_map('intval', $validated['technology_ids'] ?? []),
        );
    }
}
