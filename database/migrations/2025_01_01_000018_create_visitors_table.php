<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->timestamp('first_visit_at')->useCurrent();
            $table->timestamp('last_visit_at')->useCurrent();
            $table->unsignedInteger('visit_count')->default(1);
            $table->boolean('is_returning')->default(false);
            $table->string('device_type')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('country')->nullable();
            $table->string('region')->nullable();
            $table->boolean('has_consented')->default(false);
            $table->timestamps();

            $table->index('last_visit_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
