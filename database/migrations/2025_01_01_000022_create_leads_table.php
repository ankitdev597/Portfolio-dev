<?php

use Illuminate\Database\Migrations\Migration;

/**
 * SUPERSEDED - do not restore.
 *
 * Moved to 2025_01_01_000029_create_leads_table.php because it depends on
 * `contact_messages`, which had to move to 2025_01_01_000028 to fix a
 * foreign-key ordering bug (see that file's docblock).
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
