<?php

namespace App\Services;

use App\Models\BookRequest;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use App\Models\Member;
use App\Models\User;
use Carbon\Carbon;

/**
 * Service for generating Dashboard data
 * Handles all business logic for dashboard statistics and charts
 */
class DashboardService
{
    /**
     * Generate all dashboard data for admin/staff users
     */
    public function generateDashboardData(): array
    {
        return [
            'stats' => $this->getAllStats(),
            'newArrivals' => $this->getNewArrivals(),
            'activeCheckouts' => $this->getActiveCheckouts(),
            'comparisonChartData' => $this->getComparisonChartData('week'),
        ];
    }

    /**
     * Get all statistics with period data
     */
    public function getAllStats(): array
    {
        return [
            'titles' => [
                'total' => CatalogItem::count() + CatalogItemCopy::count(),
                'periodData' => $this->getAllPeriodData('titles'),
            ],
            'members' => [
                'total' => Member::count(),
                'periodData' => $this->getAllPeriodData('members'),
            ],
            'checkouts' => [
                'total' => BookRequest::whereIn('status', ['Approved', 'Returned'])->count(),
                'periodData' => $this->getAllPeriodData('checkouts'),
            ],
            'users' => [
                'total' => User::count(),
                'periodData' => $this->getAllPeriodData('users'),
            ],
        ];
    }

    /**
     * Get comparison chart data for a specific period
     */
    public function getComparisonChartData(string $period = 'day'): array
    {
        $now = Carbon::now();
        $data = [];

        $config = $this->getChartConfig($period, $now);

        for ($i = $config['iterations'] - 1; $i >= 0; $i--) {
            [$start, $end, $label] = $this->getIntervalBounds($config['type'], $now, $i);
            
            $data[] = [
                'label' => $label,
                'titles' => $this->getCountForPeriod('titles', $start, $end),
                'members' => $this->getCountForPeriod('members', $start, $end),
                'checkouts' => $this->getCountForPeriod('checkouts', $start, $end),
            ];
        }

        return $data;
    }

    /**
     * Get chart configuration based on period
     */
    private function getChartConfig(string $period, Carbon $now): array
    {
        return match ($period) {
            'day' => ['iterations' => 24, 'type' => 'hour'],
            'week' => ['iterations' => 7, 'type' => 'day'],
            'year' => ['iterations' => 12, 'type' => 'month'],
            default => ['iterations' => 30, 'type' => 'day'], // month
        };
    }

    /**
     * Get start/end bounds and label for a time interval
     */
    private function getIntervalBounds(string $type, Carbon $now, int $offset): array
    {
        return match ($type) {
            'hour' => [
                $now->copy()->subHours($offset)->startOfHour(),
                $now->copy()->subHours($offset)->endOfHour(),
                $now->copy()->subHours($offset)->format('g A'),
            ],
            'day' => [
                $now->copy()->subDays($offset)->startOfDay(),
                $now->copy()->subDays($offset)->endOfDay(),
                $now->copy()->subDays($offset)->format('D'),
            ],
            'month' => [
                $now->copy()->subMonths($offset)->startOfMonth(),
                $now->copy()->subMonths($offset)->endOfMonth(),
                $now->copy()->subMonths($offset)->format('M'),
            ],
            default => [
                $now->copy()->subDays($offset)->startOfDay(),
                $now->copy()->subDays($offset)->endOfDay(),
                $now->copy()->subDays($offset)->format('j'),
            ],
        };
    }

    /**
     * Get data for all time periods for a specific stat type
     */
    private function getAllPeriodData(string $statType): array
    {
        $periods = ['current', 'day', 'week', 'month', 'year'];
        $result = [];

        foreach ($periods as $period) {
            $dateRanges = $this->getDateRanges($period);
            
            $result[$period] = [
                'current' => $this->getCountForPeriod($statType, $dateRanges['current_start'], $dateRanges['current_end']),
                'previous' => $this->getCountForPeriod($statType, $dateRanges['previous_start'], $dateRanges['previous_end']),
                'graphData' => $this->getGraphData($statType, $period),
            ];
        }

        return $result;
    }

    /**
     * Get time-series graph data for a specific stat type and period
     */
    private function getGraphData(string $statType, string $period): array
    {
        $now = Carbon::now();
        $data = [];

        $config = match ($period) {
            'current' => ['iterations' => (int) $now->format('G') + 1, 'type' => 'currentHour'],
            'day' => ['iterations' => 24, 'type' => 'hour'],
            'week' => ['iterations' => 7, 'type' => 'day'],
            'month' => ['iterations' => 30, 'type' => 'dayOfMonth'],
            'year' => ['iterations' => 12, 'type' => 'month'],
            default => ['iterations' => 30, 'type' => 'dayOfMonth'],
        };

        for ($i = $config['iterations'] - 1; $i >= 0; $i--) {
            [$start, $end, $label, $date] = $this->getGraphIntervalBounds($config['type'], $now, $i, $config['iterations']);
            
            $data[] = [
                'label' => $label,
                'date' => $date,
                'value' => $this->getCountForPeriod($statType, $start, $end),
            ];
        }

        // Reverse for 'current' period to show chronologically
        if ($period === 'current') {
            $data = array_reverse($data);
        }

        return $data;
    }

    /**
     * Get graph interval bounds with proper labels
     */
    private function getGraphIntervalBounds(string $type, Carbon $now, int $offset, int $total): array
    {
        return match ($type) {
            'currentHour' => [
                $now->copy()->startOfDay()->addHours($total - 1 - $offset),
                $now->copy()->startOfDay()->addHours($total - 1 - $offset)->endOfHour(),
                $now->copy()->startOfDay()->addHours($total - 1 - $offset)->format('g A'),
                $now->copy()->startOfDay()->addHours($total - 1 - $offset)->format('M j, g A'),
            ],
            'hour' => [
                $now->copy()->subHours($offset)->startOfHour(),
                $now->copy()->subHours($offset)->endOfHour(),
                $now->copy()->subHours($offset)->format('g A'),
                $now->copy()->subHours($offset)->format('M j, g A'),
            ],
            'day' => [
                $now->copy()->subDays($offset)->startOfDay(),
                $now->copy()->subDays($offset)->endOfDay(),
                $now->copy()->subDays($offset)->format('D'),
                $now->copy()->subDays($offset)->format('M j'),
            ],
            'dayOfMonth' => [
                $now->copy()->subDays($offset)->startOfDay(),
                $now->copy()->subDays($offset)->endOfDay(),
                $now->copy()->subDays($offset)->format('j'),
                $now->copy()->subDays($offset)->format('M j'),
            ],
            'month' => [
                $now->copy()->subMonths($offset)->startOfMonth(),
                $now->copy()->subMonths($offset)->endOfMonth(),
                $now->copy()->subMonths($offset)->format('M'),
                $now->copy()->subMonths($offset)->format('F Y'),
            ],
            default => [
                $now->copy()->subDays($offset)->startOfDay(),
                $now->copy()->subDays($offset)->endOfDay(),
                $now->copy()->subDays($offset)->format('j'),
                $now->copy()->subDays($offset)->format('M j'),
            ],
        };
    }

    /**
     * Get count for a specific stat type within a date range
     */
    private function getCountForPeriod(string $statType, Carbon $start, Carbon $end): int
    {
        return match ($statType) {
            'titles' => CatalogItem::whereBetween('created_at', [$start, $end])->count() +
                        CatalogItemCopy::whereBetween('created_at', [$start, $end])->count(),
            'members' => Member::whereBetween('created_at', [$start, $end])->count(),
            'checkouts' => BookRequest::whereIn('status', ['Approved', 'Returned'])
                            ->whereBetween('created_at', [$start, $end])
                            ->count(),
            'users' => User::whereBetween('created_at', [$start, $end])->count(),
            default => 0,
        };
    }

    /**
     * Get date ranges for the selected period
     */
    private function getDateRanges(string $period): array
    {
        $now = Carbon::now();

        return match ($period) {
            'current', 'day' => [
                'current_start' => $now->copy()->startOfDay(),
                'current_end' => $now->copy()->endOfDay(),
                'previous_start' => $now->copy()->subDay()->startOfDay(),
                'previous_end' => $now->copy()->subDay()->endOfDay(),
            ],
            'week' => [
                'current_start' => $now->copy()->startOfWeek(),
                'current_end' => $now->copy()->endOfWeek(),
                'previous_start' => $now->copy()->subWeek()->startOfWeek(),
                'previous_end' => $now->copy()->subWeek()->endOfWeek(),
            ],
            'year' => [
                'current_start' => $now->copy()->startOfYear(),
                'current_end' => $now->copy()->endOfYear(),
                'previous_start' => $now->copy()->subYear()->startOfYear(),
                'previous_end' => $now->copy()->subYear()->endOfYear(),
            ],
            default => [ // month
                'current_start' => $now->copy()->startOfMonth(),
                'current_end' => $now->copy()->endOfMonth(),
                'previous_start' => $now->copy()->subMonth()->startOfMonth(),
                'previous_end' => $now->copy()->subMonth()->endOfMonth(),
            ],
        };
    }

    /**
     * Get recently added catalog items (new arrivals)
     */
    public function getNewArrivals(int $limit = 5): array
    {
        return CatalogItem::with(['authors', 'category'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'accession_no' => $item->accession_no,
                'isbn' => $item->isbn,
                'isbn13' => $item->isbn13,
                'cover_image' => $item->cover_image,
                'type' => $item->type,
                'created_at' => $item->created_at->toISOString(),
                'authors' => $item->authors->map(fn($a) => [
                    'id' => $a->id,
                    'name' => $a->name,
                ])->toArray(),
                'category' => $item->category ? [
                    'id' => $item->category->id,
                    'name' => $item->category->name,
                ] : null,
            ])
            ->toArray();
    }

    /**
     * Get active checkouts (books currently borrowed and not returned)
     */
    public function getActiveCheckouts(int $limit = 5): array
    {
        $today = Carbon::today();

        return BookRequest::with(['member', 'catalogItem'])
            ->where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->orderBy('return_date', 'asc')
            ->take($limit)
            ->get()
            ->map(function ($request) use ($today) {
                $dueDate = $request->return_date ? Carbon::parse($request->return_date) : null;
                $isOverdue = $dueDate && $dueDate->lt($today);

                return [
                    'id' => $request->id,
                    'member_id' => $request->member_id,
                    'member_name' => $request->member?->name ?? ($request->full_name ?? 'Unknown'),
                    'member_no' => $request->member?->member_no ?? 'N/A',
                    'catalog_item_id' => $request->catalog_item_id,
                    'book_title' => $request->catalogItem?->title ?? 'Unknown',
                    'cover_image' => $request->catalogItem?->cover_image,
                    'accession_no' => $request->catalogItem?->accession_no ?? 'N/A',
                    'due_date' => $dueDate?->toDateString(),
                    'date_borrowed' => $request->created_at->toDateString(),
                    'is_overdue' => $isOverdue,
                ];
            })
            ->toArray();
    }
}
