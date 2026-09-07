<?php

namespace App\Enums;

enum EmploymentType: string
{
    case FULL_TIME = 'full_time';
    case APPRENTICE = 'apprentice';
    case CONTRACT = 'contract';
    case FREELANCE = 'freelance';
    case INTERNSHIP = 'internship';

    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Full-Time',
            self::APPRENTICE => 'Apprentice',
            self::CONTRACT => 'Contract',
            self::FREELANCE => 'Freelance',
            self::INTERNSHIP => 'Internship',
        };
    }
}
