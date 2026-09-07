<?php

use Illuminate\Database\Migrations\Migration;

/**
 * SUPERSEDED - do not restore.
 *
 * This file originally created `contact_messages` here, but its foreign
 * key to `visitors` was numbered BEFORE the `visitors` table existed
 * (MySQL error 1005). The corrected version now lives in
 * 2025_01_01_000028_create_contact_messages_table.php, positioned after
 * `visitors`. `leads` and `lead_activities` had to move with it (see
 * 2025_01_01_000029 / 2025_01_01_000030) since `leads` references
 * `contact_messages`.
 *
 * Left as a harmless no-op (rather than deleted) because it was patched
 * remotely; delete it locally whenever convenient - it does nothing.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Intentionally empty - see docblock above.
    }

    public function down(): void
    {
        // Intentionally empty - see docblock above.
    }
};
