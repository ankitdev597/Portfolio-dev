<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('page_key')->unique(); // e.g. home, about, projects_index, contact
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('og_image_path')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('keywords')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
    }
};
