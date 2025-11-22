<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BookSearchController extends Controller
{
    /**
     * Search for books (AJAX endpoint for instant suggestions)
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');
        $activeOnly = $request->boolean('active_only', false);

        $results = \App\Models\CatalogItem::query()
            ->with(['category', 'publisher', 'authors'])
            ->where('title', 'LIKE', "%{$query}%")
            ->when($activeOnly, function ($q) {
                $q->where('is_active', true);
            })
            ->limit(5)
            ->get(['id', 'title', 'cover_image', 'type', 'year', 'is_active']);

        return response()->json($results);
    }

    /**
     * Show book details page
     */
    public function show($id)
    {
        $catalogItem = \App\Models\CatalogItem::with(['category', 'publisher', 'authors'])
            ->findOrFail($id);

        return inertia('BookDetails', [
            'catalogItem' => $catalogItem,
        ]);
    }

    /**
     * Show borrow request page
     */
    public function createBorrowRequest($id)
    {
        $catalogItem = \App\Models\CatalogItem::with(['category', 'publisher', 'authors'])
            ->findOrFail($id);

        return inertia('BorrowRequest', [
            'catalogItem' => $catalogItem,
        ]);
    }

    /**
     * Store borrow request
     */
    public function storeBorrowRequest(\App\Http\Requests\BookRequestStoreRequest $request)
    {
        $validated = $request->validated();
        
        // Check if the book is already borrowed
        $catalogItem = \App\Models\CatalogItem::findOrFail($validated['catalog_item_id']);
        if ($catalogItem->status === 'Borrowed') {
            return redirect()->back()->withErrors(['catalog_item_id' => 'This book is currently borrowed and not available for requests.'])->withInput();
        }
        
        // Look up member by member_no to get the actual member_id
        $member = \App\Models\Member::where('member_no', $validated['member_id'])->first();
        
        if (!$member) {
            return redirect()->back()->withErrors(['member_id' => 'Member number not found.'])->withInput();
        }
        
        // Replace member_no with actual member_id
        $validated['member_id'] = $member->id;
        
        $bookRequest = \App\Models\BookRequest::create($validated);

        // Notify all admins
        $admins = \App\Models\User::where('role', 'admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\NewBookRequestNotification($bookRequest));

        return redirect()->back()->with('success', 'Your borrow request has been submitted successfully!');
    }
}
