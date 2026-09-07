<?php

namespace App\Enums;

enum VisitorEventType: string
{
    case CTA_CLICK = 'cta_click';
    case PROJECT_VIEW = 'project_view';
    case CONTACT_SUBMIT = 'contact_submit';
    case WHATSAPP_CLICK = 'whatsapp_click';
    case EMAIL_CLICK = 'email_click';
    case LINKEDIN_CLICK = 'linkedin_click';
    case GITHUB_CLICK = 'github_click';
    case RESUME_DOWNLOAD = 'resume_download';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CTA_CLICK => 'CTA Click',
            self::PROJECT_VIEW => 'Project View',
            self::CONTACT_SUBMIT => 'Contact Form Submission',
            self::WHATSAPP_CLICK => 'WhatsApp Click',
            self::EMAIL_CLICK => 'Email Click',
            self::LINKEDIN_CLICK => 'LinkedIn Click',
            self::GITHUB_CLICK => 'GitHub Click',
            self::RESUME_DOWNLOAD => 'Resume Download',
            self::OTHER => 'Other',
        };
    }
}
