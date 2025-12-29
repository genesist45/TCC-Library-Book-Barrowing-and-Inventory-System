<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for Dashboard page
 * Keeps methods thin - delegates to DashboardService for business logic
 */
class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Display the appropriate dashboard based on user role.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Render admin dashboard for both admin and staff users
        if ($user->role === 'admin' || $user->role === 'staff') {
            $data = $this->dashboardService->generateDashboardData();

            return Inertia::render('features/Dashboard/Pages/Index', $data);
        }

        // Fallback - should not be reached since all authenticated users have a role
        abort(403, 'Unauthorized access.');
    }

    /**
     * Get chart data for a specific time period (API endpoint).
     */
    public function getChartData(Request $request): JsonResponse
    {
        $period = $request->get('period', 'month');
        $data = $this->dashboardService->getComparisonChartData($period);

        return response()->json($data);
    }
}
