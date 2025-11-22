<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookReturn;
use App\Models\BookRequest;
use App\Models\Member;
use App\Models\CatalogItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookReturns = BookReturn::with(['member', 'catalogItem', 'bookRequest', 'processor'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/BookReturns', [
            'bookReturns' => $bookReturns,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get only approved book requests that haven't been returned yet
        $availableRequests = BookRequest::with(['member', 'catalogItem'])
            ->where('status', 'Approved')
            ->whereDoesntHave('bookReturn')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'label' => "Borrow #{$request->id} - {$request->member->name} - {$request->catalogItem->title}",
                    'member_id' => $request->member_id,
                    'catalog_item_id' => $request->catalog_item_id,
                    'member_name' => $request->member->name,
                    'book_title' => $request->catalogItem->title,
                ];
            });

        return response()->json([
            'availableRequests' => $availableRequests,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_request_id' => 'required|exists:book_requests,id',
            'member_id' => 'required|exists:members,id',
            'catalog_item_id' => 'required|exists:catalog_items,id',
            'return_date' => 'required|date',
            'return_time' => 'required|date_format:H:i',
            'condition_on_return' => 'required|in:Good,Damaged,Lost',
            'remarks' => 'nullable|string',
            'penalty_amount' => 'required|numeric|min:0',
            'status' => 'required|in:Returned,Pending',
        ]);

        $validated['processed_by'] = auth()->id();

        $bookReturn = BookReturn::create($validated);

        // Mark the book as "Available" again when return is recorded
        $catalogItem = CatalogItem::find($validated['catalog_item_id']);
        if ($catalogItem) {
            $catalogItem->update(['status' => 'Available']);
        }

        return redirect()->route('admin.book-returns.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(BookReturn $bookReturn)
    {
        $bookReturn->load(['member', 'catalogItem', 'bookRequest', 'processor']);
        
        return response()->json([
            'bookReturn' => $bookReturn,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookReturn $bookReturn)
    {
        $bookReturn->load(['member', 'catalogItem', 'bookRequest']);
        
        return response()->json([
            'bookReturn' => $bookReturn,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BookReturn $bookReturn)
    {
        $validated = $request->validate([
            'return_date' => 'required|date',
            'return_time' => 'required|date_format:H:i',
            'condition_on_return' => 'required|in:Good,Damaged,Lost',
            'remarks' => 'nullable|string',
            'penalty_amount' => 'required|numeric|min:0',
            'status' => 'required|in:Returned,Pending',
        ]);

        $bookReturn->update($validated);

        return redirect()->route('admin.book-returns.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BookReturn $bookReturn)
    {
        $bookReturn->delete();
        
        return redirect()->route('admin.book-returns.index');
    }
}
