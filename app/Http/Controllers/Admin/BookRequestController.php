<?php

namespace App\Http\Controllers\Admin;

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
        ])
            ->latest()
            ->get();

        return inertia("admin/circulations/book-requests/View", [
            "bookRequests" => $bookRequests,
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

        return inertia("admin/circulations/book-requests/Show", [
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

        return inertia("admin/circulations/book-requests/Edit", [
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
}
