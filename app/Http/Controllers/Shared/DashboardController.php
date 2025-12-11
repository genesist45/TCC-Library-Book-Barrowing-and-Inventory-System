<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'checkouts' => [
                    'total' => \App\Models\BookRequest::whereIn('status', ['Approved', 'Returned'])->count(),
                    'previous' => \App\Models\BookRequest::whereIn('status', ['Approved', 'Returned'])
                        ->where('created_at', '<', $lastMonth)->count(),
                ],
                'users' => [
                    'total' => \App\Models\User::count(),
                    'previous' => \App\Models\User::where('created_at', '<', $lastMonth)->count(),
                ],
            ];

            // OPAC Stats - Total titles (catalog items + copies)
            $totalCatalogItems = \App\Models\CatalogItem::count();
            $totalCopies = \App\Models\CatalogItemCopy::count();
            $totalTitles = $totalCatalogItems + $totalCopies;
            $totalMembers = \App\Models\Member::count();

            // Get monthly trend data for the last 6 months
            $monthlyTrends = $this->getMonthlyTrends();

            $opacStats = [
                'titles' => $totalTitles,
                'members' => $totalMembers,
                'monthlyData' => $monthlyTrends,
            ];

            return Inertia::render('admin/Dashboard', [
                'stats' => $stats,
                'opacStats' => $opacStats,
            ]);
        }

        // Default to staff dashboard
        return Inertia::render('staff/Dashboard');
    }

    /**
     * Get monthly trend data for titles and members over the last 6 months.
     */
    private function getMonthlyTrends(): array
    {
        $months = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            // Count cumulative titles (catalog items + copies) up to end of month
            $catalogItemsCount = \App\Models\CatalogItem::where('created_at', '<=', $endOfMonth)->count();
            $copiesCount = \App\Models\CatalogItemCopy::where('created_at', '<=', $endOfMonth)->count();
            $titlesCount = $catalogItemsCount + $copiesCount;

            // Count cumulative members up to end of month
            $membersCount = \App\Models\Member::where('created_at', '<=', $endOfMonth)->count();

            $months[] = [
                'month' => $date->format('M'),
                'titles' => $titlesCount,
                'members' => $membersCount,
            ];
        }

        return $months;
    }


}
