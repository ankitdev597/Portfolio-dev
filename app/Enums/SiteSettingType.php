<?php

namespace App\Enums;

enum SiteSettingType: string
{
    case STRING = 'string';
    case TEXT = 'text';
    case BOOLEAN = 'boolean';
    case INTEGER = 'integer';
    case JSON = 'json';
    case IMAGE = 'image';
}
