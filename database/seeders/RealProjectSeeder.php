<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Technology;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class RealProjectSeeder extends Seeder
{
    /**
     * Ankit's real freelance/client project catalogue, drafted from a
     * shorthand list he provided directly (project names + tech stacks).
     * Every technology/feature named here is something he actually stated
     * he built - short descriptions stay generic/factual (what the system
     * does, what it integrates with) rather than inventing client
     * outcomes, metrics, or business details that weren't given (spec:
     * never fabricate project claims). All published so the public
     * Projects section isn't empty, but every field is meant to be
     * refined with real case-study detail from Admin -> Projects -
     * particularly "June Fast Firm", where the domain wasn't clear enough
     * to describe beyond "a business platform".
     *
     * Replaces DummyProjectSeeder in DatabaseSeeder's run list now that
     * real content exists - see retirePlaceholderProjects() below, which
     * soft-deletes those generic "Placeholder project..." entries so they
     * don't sit on the live site next to real work.
     */
    public function run(): void
    {
        $this->retirePlaceholderProjects();

        $categories = ProjectCategory::query()->get()->keyBy('slug');

        $projects = [
            [
                'title' => 'E-Commerce Checkout & Wallet Platform',
                'category' => 'full-stack-applications',
                'short_description' => 'A full-stack storefront with a custom checkout flow, card payment gateway integration, and an in-app digital wallet for balance-based payments.',
                'full_description' => 'End-to-end e-commerce build covering product catalog, cart, and a checkout flow wired into multiple card payment gateways plus a digital wallet so customers can pay from a stored balance as well as a card.',
                'classification' => 'real',
                'is_featured' => true,
                'technologies' => ['Laravel', 'MySQL', 'React.js', 'Stripe', 'PayPal', 'CinetPay', 'PawaPay'],
            ],
            [
                'title' => 'Service CRM with Video, Audio, SMS & Chat',
                'category' => 'real-time-websocket-apps',
                'short_description' => 'A full service-business CRM panel with live video calls, audio calls, SMS, and real-time chat built into one dashboard.',
                'full_description' => 'CRM panel giving a service business every customer-communication channel in one place: Agora-powered video/audio calling, Twilio SMS, and real-time chat/notifications over WebSockets and Firebase.',
                'classification' => 'real',
                'is_featured' => true,
                'technologies' => ['Laravel', 'WebSockets', 'Laravel Reverb', 'Agora', 'Twilio', 'Firebase'],
            ],
            [
                'title' => 'Keystone - Collision & Cleaning Service Booking',
                'category' => 'full-stack-applications',
                'short_description' => 'A service-marketplace CRM for booking collision-repair and cleaning services, with role-based staff access and built-in customer communication.',
                'full_description' => 'Booking and dispatch platform for a collision-repair/cleaning service business, with Spatie-based role management for staff/dispatchers and direct call/SMS contact with customers from the same panel.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'Spatie Laravel-Permission', 'Twilio', 'Agora'],
            ],
            [
                'title' => 'Nollywood - Multi-Role Streaming Platform',
                'category' => 'full-stack-applications',
                'short_description' => 'A Nollywood film-streaming platform with granular role and sub-role management for admins, content managers, and moderators.',
                'full_description' => 'Streaming platform for Nollywood film content, built with Spatie\'s roles-and-permissions package so admin access can be split into fine-grained roles and sub-roles rather than one flat admin level.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'Spatie Laravel-Permission', 'MySQL'],
            ],
            [
                'title' => 'TovaPulse - Health & Wellness App',
                'category' => 'full-stack-applications',
                'short_description' => 'A healthcare app connecting patients with providers, with consultation scheduling, video calls, and real-time notifications.',
                'full_description' => 'Health/wellness app (TovaPulse) pairing patients with providers - appointment scheduling, in-app video consultations, and push notifications for reminders and updates.',
                'classification' => 'real',
                'is_featured' => true,
                'technologies' => ['Laravel', 'Agora', 'Firebase', 'MySQL'],
            ],
            [
                'title' => 'SOW Finance - Bank Account Connections',
                'category' => 'full-stack-applications',
                'short_description' => 'A finance platform letting users securely create and manage bank account connections via a third-party financial data API (Plaid).',
                'full_description' => 'Finance platform (SOW) integrating Plaid to let users link external bank accounts and manage those connections from within the app.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'Plaid', 'MySQL'],
            ],
            [
                'title' => 'Turf Booking - Cricket & Football Slot Reservations',
                'category' => 'full-stack-applications',
                'short_description' => 'A turf/ground booking app for cricket and football, with real-time slot availability and online payment.',
                'full_description' => 'Booking app for cricket/football turf grounds - browse grounds, check live slot availability, reserve a time, and pay online.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'React.js', 'MySQL', 'Stripe'],
            ],
            [
                'title' => 'Job Portal - HR & Candidate Management',
                'category' => 'full-stack-applications',
                'short_description' => 'A job-portal platform pairing an HR-facing dashboard for managing openings and applicants with a candidate-facing portal for applying and tracking status.',
                'full_description' => 'Two-sided job portal: an HR dashboard for posting openings and reviewing applicants, and a candidate portal for applying and tracking application status.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'MySQL', 'React.js'],
            ],
            [
                'title' => 'Excel Data Reader & Processing Tool',
                'category' => 'cloud-devops-tooling',
                'short_description' => 'A utility that reads, validates, and imports large Excel workbooks into structured application data.',
                'full_description' => 'Bulk data-import tool for reading large Excel workbooks, validating rows against business rules, and writing the result into the application database.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'PHP'],
            ],
            [
                'title' => 'Automation Scraper & Data Collection Tool',
                'category' => 'cloud-devops-tooling',
                'short_description' => 'A scheduled scraping/automation tool that collects and normalizes data from third-party sites on a recurring basis.',
                'full_description' => 'Automated scraper running on a schedule to pull and normalize data from external sites, feeding it into the application for further use.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'PHP'],
            ],
            [
                'title' => 'Custom Cron, Queue & Signal-Aware Worker System',
                'category' => 'cloud-devops-tooling',
                'short_description' => 'A backend scheduling system for custom cron jobs and queue workers with graceful shutdown on OS signals.',
                'full_description' => 'Infrastructure layer for running custom cron-scheduled jobs and long-lived queue workers that shut down gracefully on SIGTERM/SIGINT instead of dying mid-job - built to keep background processing reliable in production.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'Redis', 'WebSockets'],
            ],
            [
                'title' => 'AI/LLM Integration Toolkit',
                'category' => 'ai-llm-projects',
                'short_description' => 'A pluggable AI layer integrating OpenAI and locally-hosted Ollama models into application workflows.',
                'full_description' => 'Provider-agnostic AI integration layer supporting OpenAI\'s API alongside self-hosted Ollama models, so the same application code can call either depending on cost/latency/privacy needs.',
                'classification' => 'real',
                'is_featured' => true,
                'technologies' => ['OpenAI API', 'LLM Integration', 'Ollama', 'Laravel'],
            ],
            [
                'title' => 'June Fast Firm',
                'category' => 'full-stack-applications',
                'short_description' => 'A business platform built for June Fast Firm - full case-study detail to be added from the admin CMS.',
                'full_description' => 'Full description pending - add problem/solution/architecture detail from Admin -> Projects.',
                'classification' => 'real',
                'is_featured' => false,
                'technologies' => ['Laravel', 'MySQL'],
            ],
        ];

        foreach ($projects as $order => $entry) {
            $slug = Str::slug($entry['title']);

            // Looked up BEFORE updateOrCreate so an existing row's
            // published_at can be preserved below - referencing the
            // variable updateOrCreate is about to assign, inside the same
            // call, would read it before it exists on a fresh insert.
            $existing = Project::query()->where('slug', $slug)->first();

            $project = Project::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'project_category_id' => $categories->get($entry['category'])?->id,
                    'title' => $entry['title'],
                    'short_description' => $entry['short_description'],
                    'full_description' => $entry['full_description'],
                    'classification' => $entry['classification'],
                    'is_featured' => $entry['is_featured'],
                    'is_published' => true,
                    // scopePublished() requires BOTH is_published=true AND a
                    // non-null published_at - without this these would
                    // silently never appear on the public site.
                    'published_at' => $existing?->published_at ?? Carbon::now()->subDays($order),
                    'display_order' => $order,
                ]
            );

            $technologyIds = Technology::query()->whereIn('name', $entry['technologies'])->pluck('id');

            $project->technologies()->sync($technologyIds);
        }
    }

    /**
     * DummyProjectSeeder's generic "Placeholder project - replace with a
     * real case study..." entries were only ever meant to fill the public
     * grid until real content existed. Now that it does, soft-delete them
     * (Project uses SoftDeletes - nothing is destroyed, and this is safe
     * to run on every boot since a re-delete of an already-trashed row is
     * a no-op) so they stop appearing next to the real catalogue above.
     */
    private function retirePlaceholderProjects(): void
    {
        $placeholderSlugs = [
            'e-commerce-platform',
            'real-time-chat-notifications',
            'ai-content-assistant',
            'cloud-deployment-pipeline',
            'task-management-dashboard',
        ];

        Project::query()->whereIn('slug', $placeholderSlugs)->delete();
    }
}
