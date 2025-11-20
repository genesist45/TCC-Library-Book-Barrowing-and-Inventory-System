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
        $bookRequests = \App\Models\BookRequest::with(['member', 'catalogItem'])
            ->latest()
            ->get();

        return inertia('admin/circulations/book-requests/View', [
            'bookRequests' => $bookRequests,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $bookRequest = \App\Models\BookRequest::with(['member', 'catalogItem'])->findOrFail($id);

        return inertia('admin/circulations/book-requests/Show', [
            'bookRequest' => $bookRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource
     */
    public function edit($id)
    {
        $bookRequest = \App\Models\BookRequest::with(['member', 'catalogItem'])->findOrFail($id);
        
        return inertia('admin/circulations/book-requests/Edit', [
            'bookRequest' => $bookRequest,
        ]);
    }

    /**
     * Update the specified resource in storage
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'quota' => 'nullable|integer|min:0',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'return_date' => 'required|date',
            'return_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
            'status' => 'required|in:Pending,Approved,Disapproved',
        ]);

        // Get the original book request before updating
        $bookRequest = \App\Models\BookRequest::with(['catalogItem.authors', 'catalogItem.publisher'])->findOrFail($id);
        
        // Store original values for comparison
        $oldStatus = $bookRequest->status;
        $oldReturnDate = $bookRequest->return_date;
        $oldReturnTime = $bookRequest->return_time;
        
        // Update the book request
        $bookRequest->update($validated);
        
        // Check if status changed
        $statusChanged = $oldStatus !== $validated['status'];
        
        // Check if return date or time changed (and status is Approved)
        $dateTimeChanged = ($oldReturnDate !== $validated['return_date'] || 
                           $oldReturnTime !== $validated['return_time']) && 
                           $validated['status'] === 'Approved';
        
        // Handle status change to "Approved"
        if ($statusChanged && $validated['status'] === 'Approved') {
            // 1. Send Approval Email
            \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(new \App\Mail\BookRequestApproved($bookRequest));
            
            // 2. Schedule Due-Date Reminder
            $this->scheduleDueDateReminder($bookRequest);
        }
        
        // Handle status change to "Disapproved"
        if ($statusChanged && $validated['status'] === 'Disapproved') {
            // Send Disapproval Email
            \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(new \App\Mail\BookRequestDisapproved($bookRequest));
        }
        
        // Handle return date/time change (for already approved requests)
        if ($dateTimeChanged && !$statusChanged) {
            // Reschedule the due-date reminder with updated date/time
            $this->scheduleDueDateReminder($bookRequest);
        }

        return redirect()->route('admin.book-requests.index')
            ->with('success', 'Book request updated successfully.');
    }
    
    /**
     * Schedule or reschedule due-date reminder
     */
    private function scheduleDueDateReminder($bookRequest)
    {
        // Extract just the date part (Y-m-d) from return_date to avoid double time specification
        $returnDateOnly = \Carbon\Carbon::parse($bookRequest->return_date)->format('Y-m-d');
        $scheduledDateTime = \Carbon\Carbon::parse($returnDateOnly . ' ' . $bookRequest->return_time);
        
        $emailData = [
            'email' => $bookRequest->email,
            'return_date' => $scheduledDateTime->format('F j, Y'),
            'return_time' => $scheduledDateTime->format('g:i A'),
            'scheduled_at' => $scheduledDateTime->toDateTimeString(),
        ];

        // Delete any existing scheduled jobs for this book request
        // This ensures we don't have duplicate reminders
        \Illuminate\Support\Facades\DB::table('jobs')
            ->where('queue', 'default')
            ->where('payload', 'like', '%"email":"' . $bookRequest->email . '"%')
            ->where('payload', 'like', '%SendBookDueReminderEmail%')
            ->delete();

        // Schedule new reminder
        if ($scheduledDateTime->isFuture()) {
            \App\Jobs\SendBookDueReminderEmail::dispatch($bookRequest->email, $emailData)
                ->delay($scheduledDateTime);
        } else {
            \App\Jobs\SendBookDueReminderEmail::dispatch($bookRequest->email, $emailData);
        }
    }

    /**
     * Remove the specified resource from storage
     */
    public function destroy($id)
    {
        $bookRequest = \App\Models\BookRequest::findOrFail($id);
        $bookRequest->delete();

        return redirect()->back()->with('success', 'Book request deleted successfully.');
    }

    public function approve($id)
    {
        $bookRequest = \App\Models\BookRequest::with(['catalogItem.authors', 'catalogItem.publisher'])->findOrFail($id);
        $bookRequest->update(['status' => 'Approved']);

        // 1. Send Approval Email
        \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(new \App\Mail\BookRequestApproved($bookRequest));

        // 2. Schedule Due-Date Reminder
        $this->scheduleDueDateReminder($bookRequest);

        return back()->with('success', 'Book request approved and reminder scheduled.');
    }

    public function disapprove($id)
    {
        $bookRequest = \App\Models\BookRequest::with(['catalogItem.authors', 'catalogItem.publisher'])->findOrFail($id);
        $bookRequest->update(['status' => 'Disapproved']);

        // Send Disapproval Email
        \Illuminate\Support\Facades\Mail::to($bookRequest->email)->send(new \App\Mail\BookRequestDisapproved($bookRequest));

        return back()->with('success', 'Book request disapproved.');
    }
}
