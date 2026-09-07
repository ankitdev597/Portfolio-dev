<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->string('headline');
            $table->string('tagline')->nullable();
            $table->unsignedTinyInteger('years_experience')->default(0);
            $table->longText('bio')->nullable();
            $table->text('short_bio')->nullable();
            $table->longText('philosophy')->nullable();
            $table->string('avatar_path')->nullable();
            $table->string('resume_path')->nullable();
            $table->string('resume_original_name')->nullable();
            $table->string('location')->nullable();
            $table->string('availability_status')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
