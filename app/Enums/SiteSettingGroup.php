<?php

namespace App\Enums;

enum SiteSettingGroup: string
{
    case GENERAL = 'general';
    case CONTACT = 'contact';
    case SOCIAL = 'social';
    case SEO = 'seo';
    case THEME = 'theme';
    case INTEGRATIONS = 'integrations';
}
