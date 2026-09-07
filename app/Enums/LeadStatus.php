<?php

namespace App\Enums;

enum LeadStatus: string
{
    case NEW = 'new';
    case CONTACTED = 'contacted';
    case INTERESTED = 'interested';
    case QUALIFIED = 'qualified';
    case CONVERTED = 'converted';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::NEW => 'New',
            self::CONTACTED => 'Contacted',
            self::INTERESTED => 'Interested',
            self::QUALIFIED => 'Qualified',
            self::CONVERTED => 'Converted',
            self::CLOSED => 'Closed',
        };
    }

    /** @return array<int, self> */
    public static function pipeline(): array
    {
        return [self::NEW, self::CONTACTED, self::INTERESTED, self::QUALIFIED, self::CONVERTED, self::CLOSED];
    }
}
