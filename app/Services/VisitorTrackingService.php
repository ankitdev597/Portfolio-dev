<?php

namespace App\Services;

use App\Models\PageView;
use App\Models\Visitor;
use App\Models\VisitorSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

/**
 * First-party, privacy-conscious visitor analytics for the public site -
 * no third-party trackers, no raw IP ever stored (sha256-hashed, same
 * convention as ActivityLogService::hashIp()), nothing beyond what the
 * visitors_/visitor_sessions_/page_views_ tables were already designed to
 * hold. Powers the admin Dashboard's visitor/session/page-view stats and
 * the "online now" count (VisitorSession::scopeOnline()).
 *
 * A returning visitor is identified by a first-party cookie (not a
 * fingerprint), and a "session" here maps 1:1 to the server-side session
 * store - one VisitorSession row per browser session, not per page view.
 */
class VisitorTrackingService
{
    private const VISITOR_COOKIE = 'pcv_visitor';

    private const SESSION_KEY = 'pcv_session_id';

    /**
     * Deliberately broad - false positives (skipping a real visitor) cost
     * nothing, false negatives (counting a crawler as a visitor) pollute
     * every stat downstream, so this errs toward skipping.
     */
    private const BOT_PATTERN = '/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|headless|monitor|uptime|pingdom|lighthouse|render\.com/i';

    public function track(Request $request): void
    {
        $userAgent = (string) $request->userAgent();

        if ($userAgent === '' || preg_match(self::BOT_PATTERN, $userAgent) === 1) {
            return;
        }

        $isNewSession = ! $request->session()->has(self::SESSION_KEY);
        [$deviceType, $browser, $os] = $this->parseUserAgent($userAgent);

        $visitor = $this->resolveVisitor($request, $isNewSession, $deviceType, $browser, $os);
        $session = $this->resolveSession($request, $visitor, $isNewSession, $deviceType, $browser, $os);

        PageView::query()->create([
            'visitor_session_id' => $session->id,
            'url' => '/'.ltrim($request->path(), '/'),
            'viewed_at' => now(),
        ]);
    }

    private function resolveVisitor(Request $request, bool $isNewSession, string $deviceType, string $browser, string $os): Visitor
    {
        $uuid = $request->cookie(self::VISITOR_COOKIE);
        $visitor = $uuid ? Visitor::query()->where('uuid', $uuid)->first() : null;

        if ($visitor) {
            $visitor->update([
                'last_visit_at' => now(),
                'is_returning' => true,
                'visit_count' => $isNewSession ? $visitor->visit_count + 1 : $visitor->visit_count,
                'device_type' => $deviceType,
                'browser' => $browser,
                'os' => $os,
            ]);

            return $visitor;
        }

        $visitor = Visitor::query()->create([
            'uuid' => (string) Str::uuid(),
            'first_visit_at' => now(),
            'last_visit_at' => now(),
            'visit_count' => 1,
            'is_returning' => false,
            'device_type' => $deviceType,
            'browser' => $browser,
            'os' => $os,
            // Anonymous, first-party, non-advertising analytics only - the
            // same bar most consent frameworks treat as "essential" or
            // "analytics" rather than requiring an opt-in gate; the public
            // cookie notice discloses this regardless (spec: "cookies and
            // all of thing").
            'has_consented' => true,
        ]);

        Cookie::queue(
            self::VISITOR_COOKIE,
            $visitor->uuid,
            60 * 24 * 365,
            path: '/',
            secure: app()->isProduction(),
            httpOnly: true,
            sameSite: 'lax',
        );

        return $visitor;
    }

    private function resolveSession(
        Request $request,
        Visitor $visitor,
        bool $isNewSession,
        string $deviceType,
        string $browser,
        string $os,
    ): VisitorSession {
        if (! $isNewSession) {
            $existing = VisitorSession::query()->find($request->session()->get(self::SESSION_KEY));

            if ($existing) {
                $existing->update(['is_online' => true, 'last_activity_at' => now()]);

                return $existing;
            }
        }

        $session = VisitorSession::query()->create([
            'visitor_id' => $visitor->id,
            'session_uuid' => (string) Str::uuid(),
            'referrer' => $request->headers->get('referer'),
            'utm_source' => $request->query('utm_source'),
            'utm_medium' => $request->query('utm_medium'),
            'utm_campaign' => $request->query('utm_campaign'),
            'utm_term' => $request->query('utm_term'),
            'utm_content' => $request->query('utm_content'),
            'landing_page' => '/'.ltrim($request->path(), '/'),
            'device_type' => $deviceType,
            'browser' => $browser,
            'os' => $os,
            'ip_hash' => $this->hashIp($request->ip()),
            'started_at' => now(),
            'is_online' => true,
            'last_activity_at' => now(),
        ]);

        $request->session()->put(self::SESSION_KEY, $session->id);

        return $session;
    }

    /**
     * Deliberately hand-rolled instead of a composer UA-parsing package
     * (e.g. jenssegers/agent) - three coarse buckets is all the Dashboard
     * needs, and it avoids adding a dependency + regenerating
     * composer.lock for it.
     *
     * @return array{0: string, 1: string, 2: string} [deviceType, browser, os]
     */
    private function parseUserAgent(string $userAgent): array
    {
        $deviceType = match (true) {
            (bool) preg_match('/tablet|ipad/i', $userAgent) => 'tablet',
            (bool) preg_match('/mobi|iphone|android/i', $userAgent) => 'mobile',
            default => 'desktop',
        };

        $browser = match (true) {
            (bool) preg_match('/edg\//i', $userAgent) => 'Edge',
            (bool) preg_match('/opr\/|opera/i', $userAgent) => 'Opera',
            (bool) preg_match('/chrome|crios/i', $userAgent) => 'Chrome',
            (bool) preg_match('/firefox|fxios/i', $userAgent) => 'Firefox',
            (bool) preg_match('/safari/i', $userAgent) => 'Safari',
            default => 'Other',
        };

        $os = match (true) {
            (bool) preg_match('/windows/i', $userAgent) => 'Windows',
            (bool) preg_match('/android/i', $userAgent) => 'Android',
            (bool) preg_match('/iphone|ipad|ios/i', $userAgent) => 'iOS',
            (bool) preg_match('/mac os|macintosh/i', $userAgent) => 'macOS',
            (bool) preg_match('/linux/i', $userAgent) => 'Linux',
            default => 'Other',
        };

        return [$deviceType, $browser, $os];
    }

    private function hashIp(?string $ip): ?string
    {
        return $ip ? hash('sha256', $ip) : null;
    }
}
