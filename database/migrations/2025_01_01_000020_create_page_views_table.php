<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_session_id')->constrained()->cascadeOnDelete();
            $table->string('url');
            $table->string('title')->nullable();
            $table->timestamp('viewed_at')->useCurrent();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->timestamps();

            $table->index('url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
