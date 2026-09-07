<?php

namespace App\Enums;

enum ProjectLinkType: string
{
    case GITHUB = 'github';
    case LIVE = 'live';
    case DEMO = 'demo';
    case CASE_STUDY = 'case_study';
    case OTHER = 'other';
}
