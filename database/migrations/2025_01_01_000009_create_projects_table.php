<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description');
            $table->longText('full_description')->nullable();
            $table->longText('problem')->nullable();
            $table->longText('solution')->nullable();
            $table->longText('architecture')->nullable();
            $table->longText('my_contribution')->nullable();
            $table->longText('challenges')->nullable();
            $table->longText('results')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->string('hero_image_path')->nullable();
            $table->string('video_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('live_url')->nullable();
            $table->string('classification')->default('personal'); // real | personal | experiment
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('og_image_path')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'is_featured']);
            $table->index('classification');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
