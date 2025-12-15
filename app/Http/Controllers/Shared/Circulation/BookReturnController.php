<?php

namespace App\Http\Controllers\Shared\Circulation;

use App\Http\Controllers\Controller;
use App\Models\BookReturn;
use App\Models\BookRequest;
use App\Models\Member;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookReturns = BookReturn::with([
            "member",
            "catalogItem",
            "bookRequest.catalogItemCopy",
            "processor",
        ])
            ->orderBy("created_at", "desc")
            ->get();

        return Inertia::render("admin/BookReturns", [
            "bookReturns" => $bookReturns,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get only approved book requests that haven't been returned yet
        $availableRequests = BookRequest::with([
            "member",
            "catalogItem",
            "catalogItemCopy",
        ])
            ->where("status", "Approved")
            ->whereDoesntHave("bookReturn")
            ->get()
            ->map(function ($request) {
                $copyInfo = $request->catalogItemCopy
                    ? " (Copy #{$request->catalogItemCopy->copy_no})"
                    : "";
                return [
                    "id" => $request->id,
                    "label" => "Borrow #{$request->id} - {$request->member->name} - {$request->catalogItem->title}{$copyInfo}",
                    "member_id" => $request->member_id,
                    "catalog_item_id" => $request->catalog_item_id,
                    "catalog_item_copy_id" => $request->catalog_item_copy_id,
                    "member_name" => $request->member->name,
                    "book_title" => $request->catalogItem->title,
                    "copy_no" => $request->catalogItemCopy?->copy_no,
                    "accession_no" => $request->catalogItemCopy?->accession_no,
                ];
            });

        return response()->json([
            "availableRequests" => $availableRequests,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "book_request_id" => "required|exists:book_requests,id",
            "member_id" => "required|exists:members,id",
            "catalog_item_id" => "required|exists:catalog_items,id",
            "return_date" => "required|date",
            "return_time" => "required|date_format:H:i",
            "condition_on_return" => "required|in:Good,Damaged,Lost",
            "remarks" => "nullable|string",
            "penalty_amount" => "required|numeric|min:0",
            "status" => "required|in:Returned,Pending",
        ]);

        $validated["processed_by"] = auth()->id();

        $bookReturn = BookReturn::create($validated);

        // Get the book request to find the associated copy
        $bookRequest = BookRequest::find($validated["book_request_id"]);

        if ($bookRequest) {
            // Mark the specific COPY as "Available" again (not the main catalog item)
            if ($bookRequest->catalog_item_copy_id) {
                $copy = CatalogItemCopy::find(
                    $bookRequest->catalog_item_copy_id,
                );
                if ($copy) {
                    // Set status based on condition
                    $newStatus =
                        $validated["condition_on_return"] === "Lost"
                        ? "Lost"
                        : ($validated["condition_on_return"] === "Damaged"
                            ? "Under Repair"
                            : "Available");
                    $copy->update(["status" => $newStatus]);
                }
            }

            // Update the BookRequest status to 'Returned'
            $bookRequest->update(["status" => "Returned"]);
        }

        return redirect()->route("admin.book-returns.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(BookReturn $bookReturn)
    {
        $bookReturn->load([
            "member",
            "catalogItem",
            "bookRequest.catalogItemCopy",
            "processor",
        ]);

        return response()->json([
            "bookReturn" => $bookReturn,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookReturn $bookReturn)
    {
        $bookReturn->load([
            "member",
            "catalogItem",
            "bookRequest.catalogItemCopy",
        ]);

        return response()->json([
            "bookReturn" => $bookReturn,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BookReturn $bookReturn)
    {
        $validated = $request->validate([
            "return_date" => "required|date",
            "return_time" => "required|date_format:H:i",
            "condition_on_return" => "required|in:Good,Damaged,Lost",
            "remarks" => "nullable|string",
            "penalty_amount" => "required|numeric|min:0",
            "status" => "required|in:Returned,Pending",
        ]);

        $bookReturn->update($validated);

        // Update the copy status based on condition if changed
        if (
            $bookReturn->bookRequest &&
            $bookReturn->bookRequest->catalog_item_copy_id
        ) {
            $copy = CatalogItemCopy::find(
                $bookReturn->bookRequest->catalog_item_copy_id,
            );
            if ($copy) {
                $newStatus =
                    $validated["condition_on_return"] === "Lost"
                    ? "Lost"
                    : ($validated["condition_on_return"] === "Damaged"
                        ? "Under Repair"
                        : "Available");
                $copy->update(["status" => $newStatus]);
            }
        }

        return redirect()->route("admin.book-returns.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BookReturn $bookReturn)
    {
        $bookReturn->delete();

        return redirect()->route("admin.book-returns.index");
    }
}
