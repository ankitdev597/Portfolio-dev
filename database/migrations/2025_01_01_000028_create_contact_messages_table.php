<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Corrected replacement for the superseded
 * 2025_01_01_000017_create_contact_messages_table.php - positioned after
 * `visitors` (2025_01_01_000018) so its foreign key resolves, and before
 * `leads` (2025_01_01_000029), which references this table.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->longText('message');
            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('status')->default('new'); // new | read | replied | archived
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
