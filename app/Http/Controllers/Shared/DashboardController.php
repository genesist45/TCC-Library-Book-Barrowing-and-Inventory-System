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

        // Render different dashboard views based on role
        if ($user->role === "admin") {
            $lastMonth = now()->subMonth();

            $stats = [
                "members" => [
                    "total" => Member::count(),
                    "previous" => Member::where(
                        "created_at",
                        "<",
                        $lastMonth,
                    )->count(),
                ],
                "checkouts" => [
                    "total" => BookRequest::whereIn("status", [
                        "Approved",
                        "Returned",
                    ])->count(),
                    "previous" => BookRequest::whereIn("status", [
                        "Approved",
                        "Returned",
                    ])
                        ->where("created_at", "<", $lastMonth)
                        ->count(),
                ],
                "users" => [
                    "total" => User::count(),
                    "previous" => User::where(
                        "created_at",
                        "<",
                        $lastMonth,
                    )->count(),
                ],
            ];

            // OPAC Stats - Total titles (catalog items + copies)
            $totalCatalogItems = CatalogItem::count();
            $totalCopies = CatalogItemCopy::count();
            $totalTitles = $totalCatalogItems + $totalCopies;
            $totalMembers = Member::count();

            // Get monthly trend data for the last 6 months
            $monthlyTrends = $this->getMonthlyTrends();

            $opacStats = [
                "titles" => $totalTitles,
                "members" => $totalMembers,
                "monthlyData" => $monthlyTrends,
            ];

            // Get new arrivals (recently added catalog items - NOT copies)
            $newArrivals = $this->getNewArrivals();

            // Get active checkouts (currently borrowed books)
            $activeCheckouts = $this->getActiveCheckouts();

            return Inertia::render("admin/Dashboard", [
                "stats" => $stats,
                "opacStats" => $opacStats,
                "newArrivals" => $newArrivals,
                "activeCheckouts" => $activeCheckouts,
            ]);
        }

        // Default to staff dashboard
        return Inertia::render("staff/Dashboard");
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
                $dueDate = $request->return_date;
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
