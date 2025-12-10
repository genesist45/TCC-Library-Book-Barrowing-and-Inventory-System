<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the appropriate dashboard based on user role.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Render different dashboard views based on role
        if ($user->role === 'admin') {
            $lastMonth = now()->subMonth();

            $stats = [
                'members' => [
                    'total' => \App\Models\Member::count(),
                    'previous' => \App\Models\Member::where('created_at', '<', $lastMonth)->count(),
                ],
                'bookRequests' => [
                    'total' => \App\Models\BookRequest::count(),
                    'previous' => \App\Models\BookRequest::where('created_at', '<', $lastMonth)->count(),
                ],
                'catalogItems' => [
                    'total' => \App\Models\CatalogItem::count(),
                    'previous' => \App\Models\CatalogItem::where('created_at', '<', $lastMonth)->count(),
                ],
            ];

            return Inertia::render('admin/Dashboard', [
                'stats' => $stats,
            ]);
        }

        // Default to staff dashboard
        return Inertia::render('staff/Dashboard');
    }
}
