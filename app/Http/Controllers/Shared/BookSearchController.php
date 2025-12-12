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
        $query = $request->input("query", "");
        $activeOnly = $request->boolean("active_only", false);

        $results = \App\Models\CatalogItem::query()
            ->with(["category", "publisher", "authors"])
            ->where("title", "LIKE", "%{$query}%")
            ->when($activeOnly, function ($q) {
                $q->where("is_active", true);
            })
            ->limit(5)
            ->get(["id", "title", "cover_image", "type", "year", "is_active"]);

        return response()->json($results);
    }

    /**
     * Show book details page
     */
    public function show($id)
    {
        $catalogItem = \App\Models\CatalogItem::with([
            "category",
            "publisher",
            "authors",
            "copies",
        ])
            ->withCount("copies")
            ->withCount([
                "copies as available_copies_count" => function ($query) {
                    $query->where("status", "Available");
                },
            ])
            ->findOrFail($id);

        // Check if there are any pending or approved (unreturned) requests for this catalog item
        $hasPendingOrActiveRequest = \App\Models\BookRequest::where("catalog_item_id", $id)
            ->whereIn("status", ["Pending", "Approved"])
            ->whereDoesntHave("bookReturn")
            ->exists();

        // Calculate availability status
        $hasAvailableCopies = $catalogItem->available_copies_count > 0;
        $hasCopies = $catalogItem->copies_count > 0;
        $allCopiesBorrowed = $hasCopies && !$hasAvailableCopies;

        return inertia("BookDetails", [
            "catalogItem" => $catalogItem,
            "hasAvailableCopies" => $hasAvailableCopies,
            "hasCopies" => $hasCopies,
            "allCopiesBorrowed" => $allCopiesBorrowed,
            "hasPendingOrActiveRequest" => $hasPendingOrActiveRequest,
        ]);
    }

    /**
     * Get book details as JSON (for API/modal usage)
     */
    public function getBookDetails($id)
    {
        $catalogItem = \App\Models\CatalogItem::with([
            "category",
            "publisher",
            "authors",
        ])->findOrFail($id);

        return response()->json($catalogItem);
    }

    /**
     * Show borrow request page
     */
    public function createBorrowRequest($id)
    {
        $catalogItem = \App\Models\CatalogItem::with([
            "category",
            "publisher",
            "authors",
            "copies",
        ])->findOrFail($id);

        return inertia("BorrowRequest", [
            "catalogItem" => $catalogItem,
        ]);
    }

    /**
     * Store borrow request
     */
    public function storeBorrowRequest(
        \App\Http\Requests\BookRequestStoreRequest $request,
    ) {
        $validated = $request->validated();

        // If a specific copy is selected, check if that copy is available
        if (!empty($validated["catalog_item_copy_id"])) {
            $copy = \App\Models\CatalogItemCopy::find(
                $validated["catalog_item_copy_id"],
            );

            if (!$copy) {
                return redirect()
                    ->back()
                    ->withErrors([
                        "catalog_item_copy_id" =>
                            "The selected copy does not exist.",
                    ])
                    ->withInput();
            }

            if ($copy->status !== "Available") {
                return redirect()
                    ->back()
                    ->withErrors([
                        "catalog_item_copy_id" =>
                            "This copy is currently not available for requests. Status: " .
                            $copy->status,
                    ])
                    ->withInput();
            }

            // Verify the copy belongs to the specified catalog item
            if ($copy->catalog_item_id != $validated["catalog_item_id"]) {
                return redirect()
                    ->back()
                    ->withErrors([
                        "catalog_item_copy_id" =>
                            "The selected copy does not belong to this catalog item.",
                    ])
                    ->withInput();
            }
        }

        // Look up member by member_no to get the actual member_id
        $member = \App\Models\Member::where(
            "member_no",
            $validated["member_id"],
        )->first();

        if (!$member) {
            return redirect()
                ->back()
                ->withErrors(["member_id" => "Member number not found."])
                ->withInput();
        }

        // Replace member_no with actual member_id
        $validated["member_id"] = $member->id;

        $bookRequest = \App\Models\BookRequest::create($validated);
        
        // Load relationships needed for notifications
        $bookRequest->load(['member', 'catalogItem']);

        // Notify all admins and staff
        $usersToNotify = \App\Models\User::whereIn("role", ["admin", "staff"])->get();
        \Illuminate\Support\Facades\Notification::send(
            $usersToNotify,
            new \App\Notifications\NewBookRequestNotification($bookRequest),
        );

        return redirect()
            ->back()
            ->with(
                "success",
                "Your borrow request has been submitted successfully!",
            );
    }
}
