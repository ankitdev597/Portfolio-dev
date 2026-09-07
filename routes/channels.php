<?php

use App\Enums\RoleName;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Wired up fully in the Real-Time Visitor Tracking phase (Laravel Reverb).
| Left here now, disabled by role, so the private admin channel exists in
| source control from day one and reviewers can see the intended shape.
*/

Broadcast::channel('admin.live-visitors', function ($user) {
    return $user->hasAnyRole([RoleName::SUPER_ADMIN->value, RoleName::EDITOR->value]);
});
