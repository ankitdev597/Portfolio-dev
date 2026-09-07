<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_session_id')->constrained()->cascadeOnDelete();
            $table->string('event_type'); // cta_click | project_view | contact_submit | whatsapp_click | email_click | linkedin_click | github_click | resume_download | other
            $table->json('meta')->nullable();
            $table->timestamp('occurred_at')->useCurrent();
            $table->timestamps();

            $table->index('event_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_events');
    }
};
