<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Renders the admin Dashboard - all real Eloquent-backed numbers via
 * DashboardService (content counts, visitor/session/page-view analytics,
 * unread messages, recent activity feed). Controller stays thin: it only
 * asks the Service for data and hands it to Inertia.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request, DashboardService $dashboard): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'roles' => $request->user()->getRoleNames(),
            'userName' => $request->user()->name,
            'stats' => $dashboard->stats(),
            'recentActivity' => $dashboard->recentActivity(),
        ]);
    }
}
