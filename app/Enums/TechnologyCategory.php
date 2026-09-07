<?php

namespace App\Enums;

enum TechnologyCategory: string
{
    case FRONTEND = 'frontend';
    case BACKEND = 'backend';
    case DATABASE = 'database';
    case CLOUD_DEVOPS = 'cloud_devops';
    case AI_LLM = 'ai_llm';
    case TOOLS = 'tools';

    public function label(): string
    {
        return match ($this) {
            self::FRONTEND => 'Frontend',
            self::BACKEND => 'Backend',
            self::DATABASE => 'Database',
            self::CLOUD_DEVOPS => 'Cloud & DevOps',
            self::AI_LLM => 'AI & LLM',
            self::TOOLS => 'Tools',
        };
    }
}
