<?php

namespace App\Enums;

enum ProjectClassification: string
{
    case REAL = 'real';
    case PERSONAL = 'personal';
    case EXPERIMENT = 'experiment';

    public function label(): string
    {
        return match ($this) {
            self::REAL => 'Real / Production Project',
            self::PERSONAL => 'Personal Project',
            self::EXPERIMENT => 'Experiment / Case Study',
        };
    }
}
