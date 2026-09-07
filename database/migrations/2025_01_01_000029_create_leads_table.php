<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Corrected replacement for the superseded
 * 2025_01_01_000022_create_leads_table.php - positioned after
 * `contact_messages` (2025_01_01_000028), which it references.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_message_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('visitor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('source')->nullable(); // contact_form | whatsapp | manual | referral
            $table->longText('message')->nullable();
            $table->string('status')->default('new'); // new | contacted | interested | qualified | converted | closed
            $table->longText('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
