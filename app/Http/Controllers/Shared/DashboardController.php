<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\BookRequest;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use App\Models\Member;
use App\Models\User;
use Carbon\Carbon;
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

        // Render admin dashboard for both admin and staff users
        // Both roles have access to the same features (except Users page which is admin-only)
        if ($user->role === "admin" || $user->role === "staff") {
            // Get all period data for each stat type
            $stats = [
                "titles" => [
                    "total" => CatalogItem::count() + CatalogItemCopy::count(),
                    "periodData" => $this->getAllPeriodData('titles'),
                ],
                "members" => [
                    "total" => Member::count(),
                    "periodData" => $this->getAllPeriodData('members'),
                ],
                "checkouts" => [
                    "total" => BookRequest::whereIn("status", ["Approved", "Returned"])->count(),
                    "periodData" => $this->getAllPeriodData('checkouts'),
                ],
                "users" => [
                    "total" => User::count(),
                    "periodData" => $this->getAllPeriodData('users'),
                ],
            ];

            // Get new arrivals (recently added catalog items - NOT copies)
            $newArrivals = $this->getNewArrivals();

            // Get active checkouts (currently borrowed books)
            $activeCheckouts = $this->getActiveCheckouts();

            return Inertia::render("admin/Dashboard", [
                "stats" => $stats,
                "newArrivals" => $newArrivals,
                "activeCheckouts" => $activeCheckouts,
            ]);
        }

        // Fallback - should not be reached since all authenticated users have a role
        abort(403, 'Unauthorized access.');
    }

    /**
     * Get data for all time periods for a specific stat type.
     */
    private function getAllPeriodData(string $statType): array
    {
        $periods = ['current', 'day', 'week', 'month', 'year'];
        $result = [];

        foreach ($periods as $period) {
            $dateRanges = $this->getDateRanges($period);
            $currentStart = $dateRanges['current_start'];
            $currentEnd = $dateRanges['current_end'];
            $previousStart = $dateRanges['previous_start'];
            $previousEnd = $dateRanges['previous_end'];

            switch ($statType) {
                case 'titles':
                    $result[$period] = [
                        'current' => CatalogItem::whereBetween("created_at", [$currentStart, $currentEnd])->count() +
                            CatalogItemCopy::whereBetween("created_at", [$currentStart, $currentEnd])->count(),
                        'previous' => CatalogItem::whereBetween("created_at", [$previousStart, $previousEnd])->count() +
                            CatalogItemCopy::whereBetween("created_at", [$previousStart, $previousEnd])->count(),
                        'graphData' => $this->getGraphData($statType, $period),
                    ];
                    break;
                case 'members':
                    $result[$period] = [
                        'current' => Member::whereBetween("created_at", [$currentStart, $currentEnd])->count(),
                        'previous' => Member::whereBetween("created_at", [$previousStart, $previousEnd])->count(),
                        'graphData' => $this->getGraphData($statType, $period),
                    ];
                    break;
                case 'checkouts':
                    $result[$period] = [
                        'current' => BookRequest::whereIn("status", ["Approved", "Returned"])
                            ->whereBetween("created_at", [$currentStart, $currentEnd])
                            ->count(),
                        'previous' => BookRequest::whereIn("status", ["Approved", "Returned"])
                            ->whereBetween("created_at", [$previousStart, $previousEnd])
                            ->count(),
                        'graphData' => $this->getGraphData($statType, $period),
                    ];
                    break;
                case 'users':
                    $result[$period] = [
                        'current' => User::whereBetween("created_at", [$currentStart, $currentEnd])->count(),
                        'previous' => User::whereBetween("created_at", [$previousStart, $previousEnd])->count(),
                        'graphData' => $this->getGraphData($statType, $period),
                    ];
                    break;
            }
        }

        return $result;
    }

    /**
     * Get time-series graph data for a specific stat type and period.
     */
    private function getGraphData(string $statType, string $period): array
    {
        $now = Carbon::now();
        $data = [];

        switch ($period) {
            case 'current':
                // Hourly data points for today (from midnight to now)
                $currentHour = (int) $now->format('G');
                for ($i = 0; $i <= $currentHour; $i++) {
                    $hourStart = $now->copy()->startOfDay()->addHours($i);
                    $hourEnd = $hourStart->copy()->endOfHour();
                    $data[] = [
                        'label' => $hourStart->format('g A'),
                        'date' => $hourStart->format('M j, g A'),
                        'value' => $this->getCountForPeriod($statType, $hourStart, $hourEnd),
                    ];
                }
                break;
            case 'day':
                // 24 hourly data points for the last 24 hours
                for ($i = 23; $i >= 0; $i--) {
                    $hourStart = $now->copy()->subHours($i)->startOfHour();
                    $hourEnd = $now->copy()->subHours($i)->endOfHour();
                    $data[] = [
                        'label' => $hourStart->format('g A'),
                        'date' => $hourStart->format('M j, g A'),
                        'value' => $this->getCountForPeriod($statType, $hourStart, $hourEnd),
                    ];
                }
                break;
            case 'week':
                // 7 daily data points for the last 7 days
                for ($i = 6; $i >= 0; $i--) {
                    $dayStart = $now->copy()->subDays($i)->startOfDay();
                    $dayEnd = $now->copy()->subDays($i)->endOfDay();
                    $data[] = [
                        'label' => $dayStart->format('D'),
                        'date' => $dayStart->format('M j'),
                        'value' => $this->getCountForPeriod($statType, $dayStart, $dayEnd),
                    ];
                }
                break;
            case 'month':
                // 30 daily data points for the last 30 days
                for ($i = 29; $i >= 0; $i--) {
                    $dayStart = $now->copy()->subDays($i)->startOfDay();
                    $dayEnd = $now->copy()->subDays($i)->endOfDay();
                    $data[] = [
                        'label' => $dayStart->format('j'),
                        'date' => $dayStart->format('M j'),
                        'value' => $this->getCountForPeriod($statType, $dayStart, $dayEnd),
                    ];
                }
                break;
            case 'year':
                // 12 monthly data points for the last 12 months
                for ($i = 11; $i >= 0; $i--) {
                    $monthStart = $now->copy()->subMonths($i)->startOfMonth();
                    $monthEnd = $now->copy()->subMonths($i)->endOfMonth();
                    $data[] = [
                        'label' => $monthStart->format('M'),
                        'date' => $monthStart->format('F Y'),
                        'value' => $this->getCountForPeriod($statType, $monthStart, $monthEnd),
                    ];
                }
                break;
        }

        return $data;
    }

    /**
     * Get count for a specific stat type within a date range.
     */
    private function getCountForPeriod(string $statType, Carbon $start, Carbon $end): int
    {
        switch ($statType) {
            case 'titles':
                return CatalogItem::whereBetween("created_at", [$start, $end])->count() +
                    CatalogItemCopy::whereBetween("created_at", [$start, $end])->count();
            case 'members':
                return Member::whereBetween("created_at", [$start, $end])->count();
            case 'checkouts':
                return BookRequest::whereIn("status", ["Approved", "Returned"])
                    ->whereBetween("created_at", [$start, $end])
                    ->count();
            case 'users':
                return User::whereBetween("created_at", [$start, $end])->count();
            default:
                return 0;
        }
    }

    /**
     * Get date ranges for the selected period.
     */
    private function getDateRanges(string $period): array
    {
        $now = Carbon::now();

        switch ($period) {
            case 'current':
                // Current = Today's data, compared to yesterday
                return [
                    'current_start' => $now->copy()->startOfDay(),
                    'current_end' => $now->copy()->endOfDay(),
                    'previous_start' => $now->copy()->subDay()->startOfDay(),
                    'previous_end' => $now->copy()->subDay()->endOfDay(),
                ];
            case 'day':
                return [
                    'current_start' => $now->copy()->startOfDay(),
                    'current_end' => $now->copy()->endOfDay(),
                    'previous_start' => $now->copy()->subDay()->startOfDay(),
                    'previous_end' => $now->copy()->subDay()->endOfDay(),
                ];
            case 'week':
                return [
                    'current_start' => $now->copy()->startOfWeek(),
                    'current_end' => $now->copy()->endOfWeek(),
                    'previous_start' => $now->copy()->subWeek()->startOfWeek(),
                    'previous_end' => $now->copy()->subWeek()->endOfWeek(),
                ];
            case 'year':
                return [
                    'current_start' => $now->copy()->startOfYear(),
                    'current_end' => $now->copy()->endOfYear(),
                    'previous_start' => $now->copy()->subYear()->startOfYear(),
                    'previous_end' => $now->copy()->subYear()->endOfYear(),
                ];
            case 'month':
            default:
                return [
                    'current_start' => $now->copy()->startOfMonth(),
                    'current_end' => $now->copy()->endOfMonth(),
                    'previous_start' => $now->copy()->subMonth()->startOfMonth(),
                    'previous_end' => $now->copy()->subMonth()->endOfMonth(),
                ];
        }
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
            $catalogItemsCount = CatalogItem::where(
                "created_at",
                "<=",
                $endOfMonth,
            )->count();
            $copiesCount = CatalogItemCopy::where(
                "created_at",
                "<=",
                $endOfMonth,
            )->count();
            $titlesCount = $catalogItemsCount + $copiesCount;

            // Count cumulative members up to end of month
            $membersCount = Member::where(
                "created_at",
                "<=",
                $endOfMonth,
            )->count();

            $months[] = [
                "month" => $date->format("M"),
                "titles" => $titlesCount,
                "members" => $membersCount,
            ];
        }

        return $months;
    }

    /**
     * Get recently added catalog items (new arrivals).
     * Only returns main catalog items, NOT copies.
     */
    private function getNewArrivals(int $limit = 5): array
    {
        return CatalogItem::with(["authors", "category"])
            ->where("is_active", true)
            ->orderBy("created_at", "desc")
            ->take($limit)
            ->get()
            ->map(function ($item) {
                return [
                    "id" => $item->id,
                    "title" => $item->title,
                    "accession_no" => $item->accession_no,
                    "isbn" => $item->isbn,
                    "isbn13" => $item->isbn13,
                    "cover_image" => $item->cover_image,
                    "type" => $item->type,
                    "created_at" => $item->created_at->toISOString(),
                    "authors" => $item->authors
                        ->map(
                            fn($a) => [
                                "id" => $a->id,
                                "name" => $a->name,
                            ],
                        )
                        ->toArray(),
                    "category" => $item->category
                        ? [
                            "id" => $item->category->id,
                            "name" => $item->category->name,
                        ]
                        : null,
                ];
            })
            ->toArray();
    }

    /**
     * Get active checkouts (books currently borrowed and not returned).
     */
    private function getActiveCheckouts(int $limit = 5): array
    {
        $today = Carbon::today();

        return BookRequest::with(["member", "catalogItem"])
            ->where("status", "Approved")
            ->whereDoesntHave("bookReturn")
            ->orderBy("return_date", "asc") // Show books due soonest first
            ->take($limit)
            ->get()
            ->map(function ($request) use ($today) {
                $dueDate = $request->return_date ? Carbon::parse($request->return_date) : null;
                $isOverdue = $dueDate && $dueDate->lt($today);

                return [
                    "id" => $request->id,
                    "member_id" => $request->member_id,
                    "member_name" =>
                        $request->member?->name ??
                        ($request->full_name ?? "Unknown"),
                    "member_no" => $request->member?->member_no ?? "N/A",
                    "catalog_item_id" => $request->catalog_item_id,
                    "book_title" => $request->catalogItem?->title ?? "Unknown",
                    "cover_image" => $request->catalogItem?->cover_image,
                    "accession_no" =>
                        $request->catalogItem?->accession_no ?? "N/A",
                    "due_date" => $dueDate?->toDateString(),
                    "date_borrowed" => $request->created_at->toDateString(),
                    "is_overdue" => $isOverdue,
                ];
            })
            ->toArray();
    }
}
