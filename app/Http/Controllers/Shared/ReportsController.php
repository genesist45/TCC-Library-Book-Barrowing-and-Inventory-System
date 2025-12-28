<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\BookRequest;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use App\Models\Category;
use App\Models\Publisher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    /**
     * Display the Catalog Reports page.
     * Shows inventory summary statistics and charts.
     */
    public function catalog(Request $request): Response
    {
        // Get date filter parameters
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        
        // Base query with optional date filtering
        $catalogItemQuery = CatalogItem::query();
        if ($dateFrom && $dateTo) {
            $catalogItemQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }
        
        // Get filtered catalog item IDs for related queries
        $filteredCatalogItemIds = $catalogItemQuery->pluck('id');
        
        // Total Books (unique titles) in Library - filtered
        $totalBooks = $filteredCatalogItemIds->count();
        
        // Total Copies in Library - filtered
        $totalCopies = CatalogItemCopy::whereIn('catalog_item_id', $filteredCatalogItemIds)->count();
        
        // Available Copies (copies with status 'Available') - filtered
        $availableCopies = CatalogItemCopy::whereIn('catalog_item_id', $filteredCatalogItemIds)
            ->where('status', 'Available')
            ->count();
        
        // Currently Borrowed (book requests that are approved but not returned)
        $borrowedBooks = BookRequest::where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->when($dateFrom && $dateTo, function ($query) use ($filteredCatalogItemIds) {
                $query->whereHas('catalogItemCopy', function ($q) use ($filteredCatalogItemIds) {
                    $q->whereIn('catalog_item_id', $filteredCatalogItemIds);
                });
            })
            ->count();
        
        // Books by Type breakdown - filtered
        $booksByTypeQuery = CatalogItem::query();
        if ($dateFrom && $dateTo) {
            $booksByTypeQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }
        $booksByType = $booksByTypeQuery->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();
        
        // Books by Category (for chart) - filtered
        $booksByCategory = Category::withCount(['catalogItems' => function ($query) use ($dateFrom, $dateTo) {
                if ($dateFrom && $dateTo) {
                    $query->whereDate('created_at', '>=', $dateFrom)
                        ->whereDate('created_at', '<=', $dateTo);
                }
            }])
            ->get()
            ->filter(function ($category) {
                return $category->catalog_items_count > 0;
            })
            ->sortByDesc('catalog_items_count')
            ->values()
            ->map(function ($category) use ($totalBooks) {
                return [
                    'name' => $category->name,
                    'count' => $category->catalog_items_count,
                    'percentage' => $totalBooks > 0 
                        ? round(($category->catalog_items_count / $totalBooks) * 100, 1) 
                        : 0,
                ];
            })
            ->toArray();
        
        // Books by Publisher (for chart) - filtered
        $booksByPublisher = Publisher::withCount(['catalogItems' => function ($query) use ($dateFrom, $dateTo) {
                if ($dateFrom && $dateTo) {
                    $query->whereDate('created_at', '>=', $dateFrom)
                        ->whereDate('created_at', '<=', $dateTo);
                }
            }])
            ->get()
            ->filter(function ($publisher) {
                return $publisher->catalog_items_count > 0;
            })
            ->sortByDesc('catalog_items_count')
            ->values()
            ->map(function ($publisher) use ($totalBooks) {
                return [
                    'name' => $publisher->name,
                    'count' => $publisher->catalog_items_count,
                    'percentage' => $totalBooks > 0 
                        ? round(($publisher->catalog_items_count / $totalBooks) * 100, 1) 
                        : 0,
                ];
            })
            ->toArray();
        
        // Low Stock Alert - Books with available copies < 3 - filtered
        $lowStockQuery = CatalogItem::with(['category'])
            ->withCount(['copies as total_copies'])
            ->withCount(['copies as available_copies' => function ($query) {
                $query->where('status', 'Available');
            }]);
        if ($dateFrom && $dateTo) {
            $lowStockQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }
        $lowStockBooks = $lowStockQuery->get()
            ->filter(function ($book) {
                return $book->available_copies < 3;
            })
            ->sortBy('available_copies')
            ->values()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'category' => $book->category?->name ?? 'Uncategorized',
                    'totalCopies' => $book->total_copies,
                    'availableCopies' => $book->available_copies,
                ];
            })
            ->toArray();
        
        // Availability Status Breakdown - filtered
        $availabilityQuery = CatalogItem::withCount(['copies as total_copies'])
            ->withCount(['copies as available_copies' => function ($query) {
                $query->where('status', 'Available');
            }]);
        if ($dateFrom && $dateTo) {
            $availabilityQuery->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo);
        }
        $catalogItemsWithAvailability = $availabilityQuery->get();
        
        // Initialize availability status counts
        $availabilityStatus = [
            'fullyAvailable' => 0,
            'highlyAvailable' => 0,
            'partiallyAvailable' => 0,
            'lowAvailability' => 0,
            'notAvailable' => 0,
        ];
        
        foreach ($catalogItemsWithAvailability as $book) {
            if ($book->total_copies === 0) {
                continue; // Skip books with no copies
            }
            
            $ratio = $book->available_copies / $book->total_copies;
            
            if ($ratio === 1.0) {
                $availabilityStatus['fullyAvailable']++;
            } elseif ($ratio >= 0.7) {
                $availabilityStatus['highlyAvailable']++;
            } elseif ($ratio >= 0.4) {
                $availabilityStatus['partiallyAvailable']++;
            } elseif ($ratio > 0) {
                $availabilityStatus['lowAvailability']++;
            } else {
                $availabilityStatus['notAvailable']++;
            }
        }
        
        // Convert to array with percentages for chart
        $availabilityBreakdown = [
            [
                'name' => 'Fully Available (100%)',
                'count' => $availabilityStatus['fullyAvailable'],
                'percentage' => $totalBooks > 0 
                    ? round(($availabilityStatus['fullyAvailable'] / $totalBooks) * 100, 1) 
                    : 0,
                'color' => '#10B981', // emerald-500
            ],
            [
                'name' => 'Highly Available (70-99%)',
                'count' => $availabilityStatus['highlyAvailable'],
                'percentage' => $totalBooks > 0 
                    ? round(($availabilityStatus['highlyAvailable'] / $totalBooks) * 100, 1) 
                    : 0,
                'color' => '#34D399', // emerald-400
            ],
            [
                'name' => 'Partially Available (40-69%)',
                'count' => $availabilityStatus['partiallyAvailable'],
                'percentage' => $totalBooks > 0 
                    ? round(($availabilityStatus['partiallyAvailable'] / $totalBooks) * 100, 1) 
                    : 0,
                'color' => '#FBBF24', // amber-400
            ],
            [
                'name' => 'Low Availability (1-39%)',
                'count' => $availabilityStatus['lowAvailability'],
                'percentage' => $totalBooks > 0 
                    ? round(($availabilityStatus['lowAvailability'] / $totalBooks) * 100, 1) 
                    : 0,
                'color' => '#F97316', // orange-500
            ],
            [
                'name' => 'Not Available (0%)',
                'count' => $availabilityStatus['notAvailable'],
                'percentage' => $totalBooks > 0 
                    ? round(($availabilityStatus['notAvailable'] / $totalBooks) * 100, 1) 
                    : 0,
                'color' => '#EF4444', // red-500
            ],
        ];
        
        return Inertia::render('features/Reports/Pages/CatalogReports', [
            'summary' => [
                'totalBooks' => $totalBooks,
                'totalCopies' => $totalCopies,
                'availableCopies' => $availableCopies,
                'borrowedBooks' => $borrowedBooks,
                'booksByType' => $booksByType,
            ],
            'booksByCategory' => $booksByCategory,
            'booksByPublisher' => $booksByPublisher,
            'lowStockBooks' => $lowStockBooks,
            'availabilityBreakdown' => $availabilityBreakdown,
        ]);
    }
}




