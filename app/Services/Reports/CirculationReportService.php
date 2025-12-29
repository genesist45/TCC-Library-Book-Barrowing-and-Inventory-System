<?php

namespace App\Services\Reports;

use App\Models\BookRequest;
use App\Models\CatalogItem;
use App\Models\Category;
use Carbon\Carbon;

/**
 * Service for generating Circulation Reports data
 * Handles all business logic for borrowing transaction statistics
 */
class CirculationReportService
{
    /**
     * Generate all circulation report data
     */
    public function generateReportData(?string $dateFrom, ?string $dateTo): array
    {
        $summary = $this->getSummary($dateFrom, $dateTo);

        return [
            'summary' => $summary,
            'mostBorrowedBooks' => $this->getMostBorrowedBooks($dateFrom, $dateTo),
            'activeLoansData' => $this->getActiveLoans($dateFrom, $dateTo),
            'borrowingTrends' => $this->getBorrowingTrends($dateFrom, $dateTo),
            'returnRateStats' => $this->getReturnRateStats($summary['totalTransactions'], $summary['activeLoans'], $dateFrom, $dateTo),
            'popularCategories' => $this->getPopularCategories($summary['totalTransactions'], $dateFrom, $dateTo),
        ];
    }

    /**
     * Get summary statistics
     */
    private function getSummary(?string $dateFrom, ?string $dateTo): array
    {
        $baseQuery = BookRequest::where('status', 'Approved');
        if ($dateFrom && $dateTo) {
            $baseQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        $totalTransactions = (clone $baseQuery)->count();
        $activeLoans = (clone $baseQuery)->whereDoesntHave('bookReturn')->count();
        $returnedBooks = (clone $baseQuery)->whereHas('bookReturn')->count();
        $avgLoanDuration = $this->calculateAverageLoanDuration($dateFrom, $dateTo);

        return [
            'totalTransactions' => $totalTransactions,
            'activeLoans' => $activeLoans,
            'returnedBooks' => $returnedBooks,
            'avgLoanDuration' => $avgLoanDuration,
        ];
    }

    /**
     * Calculate average loan duration in days
     */
    private function calculateAverageLoanDuration(?string $dateFrom, ?string $dateTo): float
    {
        $returnedWithDates = BookRequest::where('status', 'Approved')
            ->whereHas('bookReturn')
            ->with('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->get();

        if ($returnedWithDates->isEmpty()) {
            return 0;
        }

        $totalDays = $returnedWithDates->sum(function ($request) {
            $borrowDate = $request->created_at;
            $returnDate = $request->bookReturn->return_date ?? $request->bookReturn->created_at;
            return $borrowDate->diffInDays($returnDate);
        });

        return round($totalDays / $returnedWithDates->count(), 1);
    }

    /**
     * Get most borrowed books with rankings
     */
    private function getMostBorrowedBooks(?string $dateFrom, ?string $dateTo): array
    {
        return CatalogItem::withCount(['bookRequests as borrow_count' => function ($query) use ($dateFrom, $dateTo) {
                $query->where('status', 'Approved');
                if ($dateFrom && $dateTo) {
                    $query->whereDate('created_at', '>=', $dateFrom)
                        ->whereDate('created_at', '<=', $dateTo);
                }
            }])
            ->with('category')
            ->having('borrow_count', '>', 0)
            ->orderByDesc('borrow_count')
            ->limit(10)
            ->get()
            ->map(function ($book, $index) use ($dateFrom, $dateTo) {
                $lastBorrowed = $this->getLastBorrowedDate($book->id, $dateFrom, $dateTo);
                
                return [
                    'rank' => $index + 1,
                    'id' => $book->id,
                    'title' => $book->title,
                    'category' => $book->category?->name ?? 'Uncategorized',
                    'borrowCount' => $book->borrow_count,
                    'lastBorrowed' => $lastBorrowed,
                ];
            })
            ->toArray();
    }

    /**
     * Get last borrowed date for a book
     */
    private function getLastBorrowedDate(int $catalogItemId, ?string $dateFrom, ?string $dateTo): string
    {
        $query = BookRequest::where('catalog_item_id', $catalogItemId)
            ->where('status', 'Approved');
        
        if ($dateFrom && $dateTo) {
            $query->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        $lastBorrowed = $query->latest()->first();
        
        return $lastBorrowed?->created_at?->format('M d, Y') ?? 'N/A';
    }

    /**
     * Get active loans with status
     */
    private function getActiveLoans(?string $dateFrom, ?string $dateTo): array
    {
        $query = BookRequest::where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->with(['member', 'catalogItem']);
        
        if ($dateFrom && $dateTo) {
            $query->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        return $query->orderBy('return_date')
            ->get()
            ->map(function ($loan) {
                $today = now();
                $dueDate = $loan->return_date;
                $daysRemaining = $dueDate ? $today->diffInDays($dueDate, false) : null;
                
                return [
                    'id' => $loan->id,
                    'memberName' => $loan->member?->name ?? $loan->full_name ?? 'Unknown',
                    'bookTitle' => $loan->catalogItem?->title ?? 'Unknown',
                    'borrowDate' => $loan->created_at->format('M d, Y'),
                    'dueDate' => $dueDate?->format('M d, Y') ?? 'N/A',
                    'daysRemaining' => $daysRemaining,
                    'status' => $this->determineLoanStatus($daysRemaining),
                ];
            })
            ->toArray();
    }

    /**
     * Determine loan status based on days remaining
     */
    private function determineLoanStatus(?int $daysRemaining): string
    {
        if ($daysRemaining === null) return 'On Time';
        if ($daysRemaining < 0) return 'Overdue';
        if ($daysRemaining <= 3) return 'Due Soon';
        return 'On Time';
    }

    /**
     * Get borrowing trends over time
     */
    private function getBorrowingTrends(?string $dateFrom, ?string $dateTo): array
    {
        $startDate = $dateFrom ? Carbon::parse($dateFrom) : now()->subDays(29);
        $endDate = $dateTo ? Carbon::parse($dateTo) : now();

        $trends = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $count = BookRequest::where('status', 'Approved')
                ->whereDate('created_at', $currentDate->format('Y-m-d'))
                ->count();

            $trends[] = [
                'date' => $currentDate->format('M d'),
                'fullDate' => $currentDate->format('Y-m-d'),
                'count' => $count,
            ];

            $currentDate->addDay();
        }

        return $trends;
    }

    /**
     * Get return rate statistics
     */
    private function getReturnRateStats(int $totalTransactions, int $activeLoans, ?string $dateFrom, ?string $dateTo): array
    {
        $totalReturned = BookRequest::where('status', 'Approved')
            ->whereHas('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->count();

        $onTimeReturns = BookRequest::where('status', 'Approved')
            ->whereHas('bookReturn', function ($query) {
                $query->whereColumn('return_date', '<=', 'book_requests.return_date');
            })
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->count();

        $lateReturns = $totalReturned - $onTimeReturns;

        return [
            'onTimeReturns' => [
                'count' => $onTimeReturns,
                'percentage' => $totalReturned > 0 ? round(($onTimeReturns / $totalReturned) * 100, 1) : 0,
            ],
            'lateReturns' => [
                'count' => $lateReturns,
                'percentage' => $totalReturned > 0 ? round(($lateReturns / $totalReturned) * 100, 1) : 0,
            ],
            'overallReturnRate' => [
                'returned' => $totalReturned,
                'total' => $totalTransactions,
                'percentage' => $totalTransactions > 0 ? round(($totalReturned / $totalTransactions) * 100, 1) : 0,
            ],
            'stillBorrowed' => $activeLoans,
        ];
    }

    /**
     * Get popular categories by borrowing
     */
    private function getPopularCategories(int $totalTransactions, ?string $dateFrom, ?string $dateTo): array
    {
        return Category::withCount(['catalogItems as borrow_count' => function ($query) use ($dateFrom, $dateTo) {
                $query->whereHas('bookRequests', function ($q) use ($dateFrom, $dateTo) {
                    $q->where('status', 'Approved');
                    if ($dateFrom && $dateTo) {
                        $q->whereDate('created_at', '>=', $dateFrom)
                            ->whereDate('created_at', '<=', $dateTo);
                    }
                });
            }])
            ->get()
            ->filter(fn($cat) => $cat->borrow_count > 0)
            ->sortByDesc('borrow_count')
            ->values()
            ->take(10)
            ->map(fn($category) => [
                'name' => $category->name,
                'count' => $category->borrow_count,
                'percentage' => $totalTransactions > 0 
                    ? round(($category->borrow_count / $totalTransactions) * 100, 1) 
                    : 0,
            ])
            ->toArray();
    }
}
