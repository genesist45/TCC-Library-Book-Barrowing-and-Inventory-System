<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for public-facing pages
 * Handles landing page, about, and contact pages
 */
class PublicPageController extends Controller
{
    /**
     * Display the welcome/landing page with popular books
     */
    public function welcome(): Response
    {
        $popularBooks = CatalogItem::with([
            'category',
            'publisher',
            'authors',
            'copies',
        ])
            ->withCount('copies')
            ->withCount([
                'copies as available_copies_count' => function ($query) {
                    $query->where('status', 'Available');
                },
            ])
            ->where('is_active', true)
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('features/Public/Pages/Welcome', [
            'popularBooks' => $popularBooks,
        ]);
    }

    /**
     * Display the about page
     */
    public function about(): Response
    {
        return Inertia::render('features/Public/Pages/About');
    }

    /**
     * Display the contact page
     */
    public function contact(): Response
    {
        return Inertia::render('features/Public/Pages/Contact');
    }
}
