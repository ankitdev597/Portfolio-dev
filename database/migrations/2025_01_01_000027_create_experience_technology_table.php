<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Corrected replacement for the superseded
 * 2025_01_01_000003_create_experience_technology_table.php - positioned
 * after both `experiences` (2025_01_01_000002) and `technologies`
 * (2025_01_01_000008) so its foreign keys resolve.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experience_technology', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experience_id')->constrained()->cascadeOnDelete();
            $table->foreignId('technology_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['experience_id', 'technology_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experience_technology');
    }
};
