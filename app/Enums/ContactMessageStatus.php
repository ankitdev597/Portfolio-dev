<?php

namespace App\Enums;

enum ContactMessageStatus: string
{
    case NEW = 'new';
    case READ = 'read';
    case REPLIED = 'replied';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::NEW => 'New',
            self::READ => 'Read',
            self::REPLIED => 'Replied',
            self::ARCHIVED => 'Archived',
        };
    }
}
