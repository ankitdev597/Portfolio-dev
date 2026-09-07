<?php

namespace App\Enums;

enum LeadActivityType: string
{
    case STATUS_CHANGE = 'status_change';
    case NOTE = 'note';
    case EMAIL = 'email';
    case CALL = 'call';
    case WHATSAPP = 'whatsapp';
    case SYSTEM = 'system';
}
