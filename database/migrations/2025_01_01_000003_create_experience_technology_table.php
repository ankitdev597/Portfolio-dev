<?php

use Illuminate\Database\Migrations\Migration;

/**
 * SUPERSEDED - do not restore.
 *
 * This file originally created `experience_technology` here, but its
 * foreign key to `technologies` was numbered BEFORE the `technologies`
 * table existed, which fails with MySQL error 1005 ("foreign key
 * constraint is incorrectly formed"). The corrected version of this
 * migration now lives in 2025_01_01_000027_create_experience_technology_table.php,
 * positioned after both `experiences` and `technologies`.
 *
 * This file is left as a harmless no-op (rather than deleted) because it
 * was patched remotely; delete it locally whenever convenient - it does
 * nothing.
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
