<?php

namespace App\Services\Reports;

use App\Models\BookRequest;
use App\Models\BookReturn;
use App\Models\CatalogItem;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Service for generating Circulation Reports data
 * Handles all business logic for borrowing transaction statistics
 * 
 * Data Sources:
 * - BookRequest: All borrowing transactions (with status: Pending, Approved, Disapproved, Returned)
 * - BookReturn: Return records linked to BookRequests
 * - CatalogItem: Books being borrowed
 * - Category: For category-based statistics
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
            'popularCategories' => $this->getPopularCategories($dateFrom, $dateTo),
        ];
    }

    /**
     * Get summary statistics
     * Counts are based on BookRequest records with status 'Approved' or 'Returned'
     */
    private function getSummary(?string $dateFrom, ?string $dateTo): array
    {
        // Base query for all approved/returned transactions (actual borrows)
        $baseQuery = BookRequest::whereIn('status', ['Approved', 'Returned']);
        
        if ($dateFrom && $dateTo) {
            $baseQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        // Total borrowing transactions (approved + returned)
        $totalTransactions = (clone $baseQuery)->count();
        
        // Active loans = Approved requests without a return record
        $activeLoans = BookRequest::where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->count();
        
        // Returned books = Requests that have a return record OR status is 'Returned'
        $returnedBooks = BookRequest::where(function ($query) {
                $query->where('status', 'Returned')
                    ->orWhereHas('bookReturn');
            })
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->count();
        
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
     * Based on BookReturn records
     */
    private function calculateAverageLoanDuration(?string $dateFrom, ?string $dateTo): float
    {
        $returnedRequests = BookRequest::whereHas('bookReturn')
            ->with('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->get();

        if ($returnedRequests->isEmpty()) {
            return 0;
        }

        $totalDays = $returnedRequests->sum(function ($request) {
            $borrowDate = $request->created_at;
            $returnDate = $request->bookReturn->return_date ?? $request->bookReturn->created_at;
            return max(0, $borrowDate->diffInDays($returnDate));
        });

        return round($totalDays / $returnedRequests->count(), 1);
    }

    /**
     * Get most borrowed books with rankings
     * Counts all approved/returned book requests per catalog item
     */
    private function getMostBorrowedBooks(?string $dateFrom, ?string $dateTo): array
    {
        return CatalogItem::withCount(['bookRequests as borrow_count' => function ($query) use ($dateFrom, $dateTo) {
                $query->whereIn('status', ['Approved', 'Returned']);
                if ($dateFrom && $dateTo) {
                    $query->whereDate('created_at', '>=', $dateFrom)
                        ->whereDate('created_at', '<=', $dateTo);
                }
            }])
            ->with('category:id,name')
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
            ->whereIn('status', ['Approved', 'Returned']);
        
        if ($dateFrom && $dateTo) {
            $query->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        $lastBorrowed = $query->latest()->first();
        
        return $lastBorrowed?->created_at?->format('M d, Y') ?? 'N/A';
    }

    /**
     * Get active loans with status
     * Active loans are approved requests without a return record
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
                $daysRemaining = $dueDate ? round($today->floatDiffInDays($dueDate, false), 2) : null;
                
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
    private function determineLoanStatus(?float $daysRemaining): string
    {
        if ($daysRemaining === null) return 'On Time';
        if ($daysRemaining < 0) return 'Overdue';
        if ($daysRemaining <= 3) return 'Due Soon';
        return 'On Time';
    }

    /**
     * Get borrowing trends over time
     * Shows daily borrow counts for the date range
     */
    private function getBorrowingTrends(?string $dateFrom, ?string $dateTo): array
    {
        $startDate = $dateFrom ? Carbon::parse($dateFrom) : now()->subDays(29);
        $endDate = $dateTo ? Carbon::parse($dateTo) : now();

        $trends = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $count = BookRequest::whereIn('status', ['Approved', 'Returned'])
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
     * Compares on-time vs late returns
     */
    private function getReturnRateStats(int $totalTransactions, int $activeLoans, ?string $dateFrom, ?string $dateTo): array
    {
        // Total returned books (have a BookReturn record)
        $totalReturned = BookRequest::whereHas('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('created_at', '>=', $dateFrom)
                    ->whereDate('created_at', '<=', $dateTo);
            })
            ->count();

        // On-time returns: return_date in BookReturn <= return_date in BookRequest
        $onTimeReturns = BookRequest::whereHas('bookReturn', function ($query) {
                // Return was made on or before the due date
                $query->whereColumn('book_returns.return_date', '<=', 'book_requests.return_date');
            })
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('book_requests.created_at', '>=', $dateFrom)
                    ->whereDate('book_requests.created_at', '<=', $dateTo);
            })
            ->count();

        $lateReturns = max(0, $totalReturned - $onTimeReturns);

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
     * Counts actual borrow transactions per category
     */
    private function getPopularCategories(?string $dateFrom, ?string $dateTo): array
    {
        // Get borrow counts per category using a direct query
        $categoryCounts = DB::table('book_requests')
            ->join('catalog_items', 'book_requests.catalog_item_id', '=', 'catalog_items.id')
            ->join('categories', 'catalog_items.category_id', '=', 'categories.id')
            ->whereIn('book_requests.status', ['Approved', 'Returned'])
            ->when($dateFrom && $dateTo, function ($query) use ($dateFrom, $dateTo) {
                $query->whereDate('book_requests.created_at', '>=', $dateFrom)
                    ->whereDate('book_requests.created_at', '<=', $dateTo);
            })
            ->select('categories.id', 'categories.name', DB::raw('COUNT(*) as borrow_count'))
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('borrow_count')
            ->limit(10)
            ->get();

        $totalBorrows = $categoryCounts->sum('borrow_count');

        return $categoryCounts->map(fn($category) => [
            'name' => $category->name,
            'count' => $category->borrow_count,
            'percentage' => $totalBorrows > 0 
                ? round(($category->borrow_count / $totalBorrows) * 100, 1) 
                : 0,
        ])->toArray();
    }
}
