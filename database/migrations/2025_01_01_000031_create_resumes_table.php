<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            // e.g. "Full Stack Developer", "Backend Developer" - lets one
            // owner publish a different resume PDF tailored per role/track
            // instead of a single one-size-fits-all file.
            $table->string('role_title');
            $table->string('label')->nullable();
            $table->string('file_path');
            $table->string('file_original_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};
