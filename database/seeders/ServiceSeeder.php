<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Service categories as suggested directly in the project spec (#16),
     * based on Ankit's professional skills. Editable from admin afterwards.
     */
    public function run(): void
    {
        $services = [
            ['title' => 'Full Stack Development', 'short_description' => 'End-to-end web application development from database to UI.'],
            ['title' => 'Laravel Development', 'short_description' => 'Robust, scalable backends built on Laravel and PHP.'],
            ['title' => 'React Development', 'short_description' => 'Modern, interactive frontends built with React and TypeScript.'],
            ['title' => 'MERN Development', 'short_description' => 'Full JavaScript-stack applications with MongoDB, Express, React, and Node.js.'],
            ['title' => 'AI / LLM Integration', 'short_description' => 'Integrating OpenAI and other LLMs into production applications.'],
            ['title' => 'API Development', 'short_description' => 'RESTful API architecture and integration.'],
            ['title' => 'AWS Deployment', 'short_description' => 'Cloud infrastructure and deployment on AWS (EC2, SES, SNS).'],
            ['title' => 'CI/CD', 'short_description' => 'Automated build, test, and deployment pipelines.'],
            ['title' => 'Server Configuration', 'short_description' => 'Linux server administration, Nginx/Apache, and SSL setup.'],
            ['title' => 'Real-Time WebSocket Applications', 'short_description' => 'Real-time features powered by WebSockets and Laravel Reverb.'],
        ];

        foreach ($services as $index => $service) {
            Service::query()->updateOrCreate(
                ['slug' => Str::slug($service['title'])],
                [...$service, 'is_active' => true, 'display_order' => $index]
            );
        }
    }
}
