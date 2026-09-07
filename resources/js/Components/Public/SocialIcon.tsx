interface SocialIconProps {
    platform: string;
    className?: string;
}

/**
 * Maps a SocialLink's `platform` key to an inline SVG glyph. Falls back to
 * a generic external-link icon for any platform not explicitly listed here
 * (e.g. a future Twitter/X or personal-site link added from the admin CMS)
 * so a new platform never renders as a broken image.
 */
export function SocialIcon({ platform, className = 'h-5 w-5' }: SocialIconProps) {
    switch (platform) {
        case 'github':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.28 5.69.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.2.66.79.55C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5Z" />
                </svg>
            );
        case 'linkedin':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
                </svg>
            );
        case 'whatsapp':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
                    <path d="M12.02 2C6.5 2 2 6.5 2 12.02c0 1.9.53 3.68 1.44 5.2L2 22l4.9-1.4a9.96 9.96 0 0 0 5.12 1.4c5.52 0 10.02-4.5 10.02-10.02C22.04 6.5 17.54 2 12.02 2Zm5.87 14.28c-.25.7-1.44 1.35-1.98 1.4-.5.06-1.14.08-1.84-.12-.42-.12-.96-.3-1.65-.6-2.9-1.25-4.79-4.16-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36l.55.01c.18 0 .42-.07.65.5.25.6.85 2.08.92 2.23.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.75 1.24 1.62 2 1.11.99 2.05 1.3 2.35 1.45.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.73.82 2.02.97.3.15.5.22.57.35.07.13.07.72-.18 1.4Z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M10 14 19 5M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
                </svg>
            );
    }
}
