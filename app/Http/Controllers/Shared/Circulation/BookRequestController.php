<?php

namespace App\Http\Controllers\Shared\Circulation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BookRequestController extends Controller
{
    /**
     * Display a listing of book requests
     */
    public function index()
    {
        $bookRequests = \App\Models\BookRequest::with([
            "member",
            "catalogItem",
            "catalogItemCopy",
            "bookReturn",
        ])
            ->latest()
            ->get();

        // Get all catalog items with their copies for the Add Borrow Member modal
        $catalogItems = \App\Models\CatalogItem::with([
            'category:id,name',
            'publisher:id,name',
            'authors:id,name',
            'copies' => function ($query) {
                $query->select('id', 'catalog_item_id', 'copy_no', 'accession_no', 'status', 'branch', 'location');
            }
        ])
            ->withCount('copies')
            ->withCount([
                'copies as available_copies_count' => function ($query) {
                    $query->where('status', 'Available');
                }
            ])
            ->orderBy('title')
            ->get();

        return inertia("features/Circulations/Pages/Index", [
            "bookRequests" => $bookRequests,
            "catalogItems" => $catalogItems,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $bookRequest = \App\Models\BookRequest::with([
            "member",
            "catalogItem.authors",
            "catalogItem.publisher",
            "catalogItemCopy",
        ])->findOrFail($id);

        return inertia("features/Circulations/Pages/Show", [
            "bookRequest" => $bookRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource
     */
    public function edit($id)
    {
        $bookRequest = \App\Models\BookRequest::with([
            "member",
            "catalogItem.authors",
            "catalogItem.publisher",
            "catalogItemCopy",
        ])->findOrFail($id);

        return inertia("features/Circulations/Pages/Edit", [
            "bookRequest" => $bookRequest,
        ]);
    }

    /**
     * Update the specified resource in storage
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            "full_name" => "required|string|max:255",
            "email" => "required|email",
            "quota" => "nullable|integer|min:0",
            "phone" => "nullable|string|max:20",
            "address" => "nullable|string",
            "return_date" => "required|date",
            "return_time" => "required|date_format:H:i",
            "notes" => "nullable|string",
            "status" => "required|in:Pending,Approved,Disapproved,Returned",
        ]);

        // Get the original book request before updating
        $bookRequest = \App\Models\BookRequest::with([
            "catalogItem.authors",
            "catalogItem.publisher",
            "catalogItemCopy",
        ])->findOrFail($id);

        // Store original values for comparison
        $oldStatus = $bookRequest->status;
        $oldReturnDate = $bookRequest->return_date;
        $oldReturnTime = $bookRequest->return_time;

        // Update the book request
        $bookRequest->update($validated);

        // Check if status changed
        $statusChanged = $oldStatus !== $validated["status"];

        // Check if return date or time changed (and status is Approved)
        $dateTimeChanged =
            ($oldReturnDate !== $validated["return_date"] ||
                $oldReturnTime !== $validated["return_time"]) &&
            $validated["status"] === "Approved";

        // Check if trying to approve or disapprove a pending request when copy is borrowed
        if (
            $statusChanged &&
            ($validated["status"] === "Approved" ||
                $validated["status"] === "Disapproved")
        ) {
            if (
                $oldStatus === "Pending" &&
                $bookRequest->catalogItemCopy &&
                $bookRequest->catalogItemCopy->status === "Borrowed"
            ) {
                return redirect()
                    ->back()
                    ->with(
                        "error",
                        "This copy is already borrowed and cannot be approved or declined.",
                    );
            }
        }

        // Handle status change to "Approved"
        if ($statusChanged && $validated["status"] === "Approved") {
            // If no specific copy was selected, try to find an available copy
            if (!$bookRequest->catalog_item_copy_id) {
                $bookRequest->load("catalogItem.copies");
                $availableCopy = $bookRequest->catalogItem->copies()
                    ->where("status", "Available")
                    ->first();

                if ($availableCopy) {
                    // Assign this copy to the request
                    $bookRequest->update(["catalog_item_copy_id" => $availableCopy->id]);
                    $bookRequest->load("catalogItemCopy");
                } else {
                    // No available copies exist - block approval
                    // Revert the status back to the original
                    $bookRequest->update(["status" => $oldStatus]);

                    return redirect()
                        ->back()
                        ->with(
                            "error",
                            "No available copies for this title.",
                        );
                }
            }

            // 1. Mark the copy as "Borrowed"
            if ($bookRequest->catalogItemCopy) {
                $bookRequest->catalogItemCopy->update(["status" => "Borrowed"]);
            }

            // 2. Send Approval Email
            \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(
                new \App\Mail\BookRequestApproved($bookRequest),
            );

            // 3. Schedule Due-Date Reminder
            $this->scheduleDueDateReminder($bookRequest);
        }

        // Handle status change to "Disapproved"
        if ($statusChanged && $validated["status"] === "Disapproved") {
            // If it was previously approved, mark the copy as "Available" again
            if ($oldStatus === "Approved" && $bookRequest->catalogItemCopy) {
                $bookRequest->catalogItemCopy->update([
                    "status" => "Available",
                ]);
            }

            // Send Disapproval Email
            \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(
                new \App\Mail\BookRequestDisapproved($bookRequest),
            );
        }

        // Handle return date/time change (for already approved requests)
        if ($dateTimeChanged && !$statusChanged) {
            // Reschedule the due-date reminder with updated date/time
            $this->scheduleDueDateReminder($bookRequest);
        }

        return redirect()
            ->route("admin.book-requests.index")
            ->with("success", "Book request updated successfully.");
    }

    /**
     * Schedule or reschedule due-date reminder
     */
    private function scheduleDueDateReminder($bookRequest)
    {
        // Extract just the date part (Y-m-d) from return_date to avoid double time specification
        $returnDateOnly = \Carbon\Carbon::parse(
            $bookRequest->return_date,
        )->format("Y-m-d");
        $scheduledDateTime = \Carbon\Carbon::parse(
            $returnDateOnly . " " . $bookRequest->return_time,
        );

        $emailData = [
            "email" => $bookRequest->email,
            "return_date" => $scheduledDateTime->format("F j, Y"),
            "return_time" => $scheduledDateTime->format("g:i A"),
            "scheduled_at" => $scheduledDateTime->toDateTimeString(),
        ];

        // Delete any existing scheduled jobs for this book request
        // This ensures we don't have duplicate reminders
        \Illuminate\Support\Facades\DB::table("jobs")
            ->where("queue", "default")
            ->where(
                "payload",
                "like",
                '%"email":"' . $bookRequest->email . '"%',
            )
            ->where("payload", "like", "%SendBookDueReminderEmail%")
            ->delete();

        // Schedule new reminder
        if ($scheduledDateTime->isFuture()) {
            \App\Jobs\SendBookDueReminderEmail::dispatch(
                $bookRequest->email,
                $emailData,
            )->delay($scheduledDateTime);
        } else {
            \App\Jobs\SendBookDueReminderEmail::dispatch(
                $bookRequest->email,
                $emailData,
            );
        }
    }

    /**
     * Remove the specified resource from storage
     */
    public function destroy($id)
    {
        $bookRequest = \App\Models\BookRequest::findOrFail($id);
        $bookRequest->delete();

        return redirect()
            ->back()
            ->with("success", "Book request deleted successfully.");
    }

    public function approve($id)
    {
        $bookRequest = \App\Models\BookRequest::with([
            "catalogItem.copies",
            "catalogItem.authors",
            "catalogItem.publisher",
            "catalogItemCopy",
        ])->findOrFail($id);

        // If a specific copy was requested, check if it's already borrowed
        if (
            $bookRequest->catalogItemCopy &&
            $bookRequest->catalogItemCopy->status === "Borrowed"
        ) {
            return back()->with(
                "error",
                "This copy is already borrowed and cannot be approved.",
            );
        }

        // If no specific copy was selected, try to find an available copy
        if (!$bookRequest->catalog_item_copy_id) {
            $availableCopy = $bookRequest->catalogItem->copies()
                ->where("status", "Available")
                ->first();

            if ($availableCopy) {
                // Assign this copy to the request
                $bookRequest->update(["catalog_item_copy_id" => $availableCopy->id]);
                $bookRequest->load("catalogItemCopy");
            } else {
                // No available copies exist - block approval
                return back()->with(
                    "error",
                    "No available copies for this title.",
                );
            }
        }

        // Now approve the request
        $bookRequest->update(["status" => "Approved"]);

        // Mark the copy as "Borrowed"
        if ($bookRequest->catalogItemCopy) {
            $bookRequest->catalogItemCopy->update(["status" => "Borrowed"]);
        }

        // 1. Send Approval Email
        \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(
            new \App\Mail\BookRequestApproved($bookRequest),
        );

        // 2. Schedule Due-Date Reminder
        $this->scheduleDueDateReminder($bookRequest);

        return back()->with(
            "success",
            "Book request approved and reminder scheduled.",
        );
    }

    public function disapprove($id)
    {
        $bookRequest = \App\Models\BookRequest::with([
            "catalogItem.authors",
            "catalogItem.publisher",
            "catalogItemCopy",
        ])->findOrFail($id);

        // Check if the copy is already borrowed (and this request is not the one holding it)
        // If the request is already Approved, we might be disapproving it to return the book, so we allow that.
        // But if it's Pending and copy is Borrowed, we block it.
        if (
            $bookRequest->status === "Pending" &&
            $bookRequest->catalogItemCopy &&
            $bookRequest->catalogItemCopy->status === "Borrowed"
        ) {
            return back()->with(
                "error",
                "This copy is already borrowed and cannot be declined.",
            );
        }

        // If it was previously approved, mark the copy as "Available" again
        if (
            $bookRequest->status === "Approved" &&
            $bookRequest->catalogItemCopy
        ) {
            $bookRequest->catalogItemCopy->update(["status" => "Available"]);
        }

        $bookRequest->update(["status" => "Disapproved"]);

        // Send Disapproval Email
        \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(
            new \App\Mail\BookRequestDisapproved($bookRequest),
        );

        return back()->with("success", "Book request disapproved.");
    }

    /**
     * Store a new book request with auto-approval (for admin/staff use)
     */
    public function storeApproved(Request $request)
    {
        $validated = $request->validate([
            "member_id" => "required|exists:members,member_no",
            "catalog_item_id" => "required|exists:catalog_items,id",
            "catalog_item_copy_id" => "required|exists:catalog_item_copies,id",
            "return_date" => "required|date|after_or_equal:today",
            "return_time" => "required|date_format:H:i",
            "address" => "nullable|string",
            "notes" => "nullable|string",
        ]);

        // Get the member by member_no
        $member = \App\Models\Member::where("member_no", $validated["member_id"])->first();

        if (!$member) {
            return back()->withErrors(["member_id" => "Member not found."]);
        }

        // Check if the copy is available
        $copy = \App\Models\CatalogItemCopy::find($validated["catalog_item_copy_id"]);

        if (!$copy || $copy->status !== "Available") {
            return back()->withErrors(["catalog_item_copy_id" => "This copy is not available for borrowing."]);
        }

        // Create the book request with Approved status
        $bookRequest = \App\Models\BookRequest::create([
            "member_id" => $member->id,
            "catalog_item_id" => $validated["catalog_item_id"],
            "catalog_item_copy_id" => $validated["catalog_item_copy_id"],
            "full_name" => $member->name,
            "email" => $member->email,
            "quota" => $member->booking_quota,
            "phone" => $member->phone,
            "address" => $validated["address"] ?? null,
            "return_date" => $validated["return_date"],
            "return_time" => $validated["return_time"],
            "notes" => $validated["notes"] ?? null,
            "status" => "Approved", // Auto-approved
        ]);

        // Mark the copy as "Borrowed"
        $copy->update(["status" => "Borrowed"]);

        // Load relationships for email
        $bookRequest->load([
            "catalogItem.authors",
            "catalogItem.publisher",
            "catalogItemCopy",
        ]);

        // Send Approval Email
        \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(
            new \App\Mail\BookRequestApproved($bookRequest),
        );

        // Schedule Due-Date Reminder
        $this->scheduleDueDateReminder($bookRequest);

        return back()->with("success", "Borrow record created and approved successfully.");
    }

    /**
     * Display the borrow catalog page with two-card layout
     */
    public function borrowCatalog(Request $request)
    {
        // Get all catalog items with their copies for selection
        $catalogItems = \App\Models\CatalogItem::with([
            'category:id,name',
            'publisher:id,name',
            'authors:id,name',
            'copies' => function ($query) {
                $query->select('id', 'catalog_item_id', 'copy_no', 'accession_no', 'status', 'branch', 'location');
            }
        ])
            ->withCount('copies')
            ->withCount([
                'copies as available_copies_count' => function ($query) {
                    $query->where('status', 'Available');
                }
            ])
            ->orderBy('title')
            ->get();

        // Get filter options
        $authors = \App\Models\Author::select('id', 'name')
            ->orderBy('name')
            ->get();

        $publishers = \App\Models\Publisher::select('id', 'name')
            ->orderBy('name')
            ->get();

        $categories = \App\Models\Category::select('id', 'name')
            ->orderBy('name')
            ->get();

        return inertia("features/Circulations/Pages/BorrowCatalog", [
            "catalogItems" => $catalogItems,
            "authors" => $authors,
            "publishers" => $publishers,
            "categories" => $categories,
        ]);
    }

    /**
     * Display the available copies page for a catalog item
     */
    public function availableCopies(\App\Models\CatalogItem $catalogItem)
    {
        // Load the catalog item with all its copies and related data
        $catalogItem->load([
            'category:id,name',
            'publisher:id,name',
            'authors:id,name',
            'copies' => function ($query) {
                $query->select('id', 'catalog_item_id', 'copy_no', 'accession_no', 'status', 'branch', 'location')
                    ->orderBy('copy_no');
            }
        ]);

        // Add counts
        $catalogItem->loadCount('copies');
        $catalogItem->loadCount([
            'copies as available_copies_count' => function ($query) {
                $query->where('status', 'Available');
            }
        ]);

        return inertia("features/Circulations/Pages/AvailableCopiesPage", [
            "catalogItem" => $catalogItem,
        ]);
    }
}

