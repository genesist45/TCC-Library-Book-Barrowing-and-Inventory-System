<?php

namespace App\Services\Reports;

use App\Models\BookRequest;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use App\Models\Category;
use App\Models\Publisher;

/**
 * Service for generating Catalog Reports data
 * Handles all business logic for inventory statistics
 */
class CatalogReportService
{
    /**
     * Generate all catalog report data
     */
    public function generateReportData(?string $dateFrom, ?string $dateTo): array
    {
        $filteredCatalogItemIds = $this->getFilteredCatalogItemIds($dateFrom, $dateTo);
        $totalBooks = $filteredCatalogItemIds->count();

        return [
            'summary' => $this->getSummary($filteredCatalogItemIds, $totalBooks, $dateFrom, $dateTo),
            'booksByCategory' => $this->getBooksByCategory($totalBooks, $dateFrom, $dateTo),
            'booksByPublisher' => $this->getBooksByPublisher($totalBooks, $dateFrom, $dateTo),
            'lowStockBooks' => $this->getLowStockBooks($dateFrom, $dateTo),
            'availabilityBreakdown' => $this->getAvailabilityBreakdown($totalBooks, $dateFrom, $dateTo),
        ];
    }

    /**
     * Get filtered catalog item IDs based on date range
     */
    private function getFilteredCatalogItemIds(?string $dateFrom, ?string $dateTo)
    {
        $query = CatalogItem::query();
        
        if ($dateFrom && $dateTo) {
            $query->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        return $query->pluck('id');
    }

    /**
     * Get summary statistics
     */
    private function getSummary($filteredCatalogItemIds, int $totalBooks, ?string $dateFrom, ?string $dateTo): array
    {
        // Total Copies
        $totalCopies = CatalogItemCopy::whereIn('catalog_item_id', $filteredCatalogItemIds)->count();
        
        // Available Copies
        $availableCopies = CatalogItemCopy::whereIn('catalog_item_id', $filteredCatalogItemIds)
            ->where('status', 'Available')
            ->count();
        
        // Currently Borrowed
        $borrowedBooks = BookRequest::where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($filteredCatalogItemIds) {
                $query->whereHas('catalogItemCopy', function ($q) use ($filteredCatalogItemIds) {
                    $q->whereIn('catalog_item_id', $filteredCatalogItemIds);
                });
            })
            ->count();
        
        // Books by Type
        $booksByTypeQuery = CatalogItem::query();
        if ($dateFrom && $dateTo) {
            $booksByTypeQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }
        $booksByType = $booksByTypeQuery->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return [
            'totalBooks' => $totalBooks,
            'totalCopies' => $totalCopies,
            'availableCopies' => $availableCopies,
            'borrowedBooks' => $borrowedBooks,
            'booksByType' => $booksByType,
        ];
    }

    /**
     * Get books by category chart data
     */
    private function getBooksByCategory(int $totalBooks, ?string $dateFrom, ?string $dateTo): array
    {
        return Category::withCount(['catalogItems' => function ($query) use ($dateFrom, $dateTo) {
                if ($dateFrom && $dateTo) {
                    $query->whereDate('created_at', '>=', $dateFrom)
                        ->whereDate('created_at', '<=', $dateTo);
                }
            }])
            ->get()
            ->filter(fn($category) => $category->catalog_items_count > 0)
            ->sortByDesc('catalog_items_count')
            ->values()
            ->map(fn($category) => [
                'name' => $category->name,
                'count' => $category->catalog_items_count,
                'percentage' => $totalBooks > 0 
                    ? round(($category->catalog_items_count / $totalBooks) * 100, 1) 
                    : 0,
            ])
            ->toArray();
    }

    /**
     * Get books by publisher chart data
     */
    private function getBooksByPublisher(int $totalBooks, ?string $dateFrom, ?string $dateTo): array
    {
        return Publisher::withCount(['catalogItems' => function ($query) use ($dateFrom, $dateTo) {
                if ($dateFrom && $dateTo) {
                    $query->whereDate('created_at', '>=', $dateFrom)
                        ->whereDate('created_at', '<=', $dateTo);
                }
            }])
            ->get()
            ->filter(fn($publisher) => $publisher->catalog_items_count > 0)
            ->sortByDesc('catalog_items_count')
            ->values()
            ->map(fn($publisher) => [
                'name' => $publisher->name,
                'count' => $publisher->catalog_items_count,
                'percentage' => $totalBooks > 0 
                    ? round(($publisher->catalog_items_count / $totalBooks) * 100, 1) 
                    : 0,
            ])
            ->toArray();
    }

    /**
     * Get low stock books (available copies < 3)
     */
    private function getLowStockBooks(?string $dateFrom, ?string $dateTo): array
    {
        $query = CatalogItem::with(['category'])
            ->withCount(['copies as total_copies'])
            ->withCount(['copies as available_copies' => fn($q) => $q->where('status', 'Available')]);
        
        if ($dateFrom && $dateTo) {
            $query->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        return $query->get()
            ->filter(fn($book) => $book->available_copies < 3)
            ->sortBy('available_copies')
            ->values()
            ->map(fn($book) => [
                'id' => $book->id,
                'title' => $book->title,
                'category' => $book->category?->name ?? 'Uncategorized',
                'totalCopies' => $book->total_copies,
                'availableCopies' => $book->available_copies,
            ])
            ->toArray();
    }

    /**
     * Get availability status breakdown
     */
    private function getAvailabilityBreakdown(int $totalBooks, ?string $dateFrom, ?string $dateTo): array
    {
        $query = CatalogItem::withCount(['copies as total_copies'])
            ->withCount(['copies as available_copies' => fn($q) => $q->where('status', 'Available')]);
        
        if ($dateFrom && $dateTo) {
            $query->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }

        $items = $query->get();

        // Initialize counts
        $status = [
            'fullyAvailable' => 0,
            'highlyAvailable' => 0,
            'partiallyAvailable' => 0,
            'lowAvailability' => 0,
            'notAvailable' => 0,
        ];

        foreach ($items as $book) {
            if ($book->total_copies === 0) continue;
            
            $ratio = $book->available_copies / $book->total_copies;
            
            if ($ratio === 1.0) $status['fullyAvailable']++;
            elseif ($ratio >= 0.7) $status['highlyAvailable']++;
            elseif ($ratio >= 0.4) $status['partiallyAvailable']++;
            elseif ($ratio > 0) $status['lowAvailability']++;
            else $status['notAvailable']++;
        }

        return [
            ['name' => 'Fully Available (100%)', 'count' => $status['fullyAvailable'], 
             'percentage' => $this->calcPercentage($status['fullyAvailable'], $totalBooks), 'color' => '#10B981'],
            ['name' => 'Highly Available (70-99%)', 'count' => $status['highlyAvailable'], 
             'percentage' => $this->calcPercentage($status['highlyAvailable'], $totalBooks), 'color' => '#34D399'],
            ['name' => 'Partially Available (40-69%)', 'count' => $status['partiallyAvailable'], 
             'percentage' => $this->calcPercentage($status['partiallyAvailable'], $totalBooks), 'color' => '#FBBF24'],
            ['name' => 'Low Availability (1-39%)', 'count' => $status['lowAvailability'], 
             'percentage' => $this->calcPercentage($status['lowAvailability'], $totalBooks), 'color' => '#F97316'],
            ['name' => 'Not Available (0%)', 'count' => $status['notAvailable'], 
             'percentage' => $this->calcPercentage($status['notAvailable'], $totalBooks), 'color' => '#EF4444'],
        ];
    }

    /**
     * Calculate percentage safely
     */
    private function calcPercentage(int $count, int $total): float
    {
        return $total > 0 ? round(($count / $total) * 100, 1) : 0;
    }
}
