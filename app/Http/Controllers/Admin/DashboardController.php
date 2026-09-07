<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Phase-1 placeholder: proves the authenticated admin shell, layout, and
 * role sharing work end to end. Real widgets (visitor stats, charts,
 * recent leads, live visitors) are wired up in the CRM/Analytics phase
 * against real Eloquent queries - not stubbed here.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'roles' => $request->user()->getRoleNames(),
        ]);
    }
}
