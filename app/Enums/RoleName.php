<?php

namespace App\Enums;

enum RoleName: string
{
    case SUPER_ADMIN = 'super_admin';
    case EDITOR = 'editor';

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::EDITOR => 'Editor',
        };
    }
}
