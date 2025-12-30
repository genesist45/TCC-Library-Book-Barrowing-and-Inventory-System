<?php

namespace App\Services\Circulation;

use App\Jobs\SendBookDueReminderEmail;
use App\Mail\BookRequestApproved;
use App\Mail\BookRequestDisapproved;
use App\Models\Author;
use App\Models\BookRequest;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use App\Models\Category;
use App\Models\Member;
use App\Models\Publisher;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

/**
 * Service for managing Book Request business logic
 */
class BookRequestService
{
    /**
     * Get all book requests with relationships for index page
     */
    public function getAllBookRequests(): array
    {
        $bookRequests = BookRequest::with([
            'member',
            'catalogItem',
            'catalogItemCopy',
            'bookReturn',
        ])->latest()->get();

        return $bookRequests->toArray();
    }

    /**
     * Get all catalog items with copies for borrow modal
     */
    public function getCatalogItemsForBorrowing()
    {
        return CatalogItem::with([
            'category:id,name',
            'publisher:id,name',
            'authors:id,name',
            'copies' => fn($q) => $q->select('id', 'catalog_item_id', 'copy_no', 'accession_no', 'status', 'branch', 'location'),
        ])
            ->withCount('copies')
            ->withCount(['copies as available_copies_count' => fn($q) => $q->where('status', 'Available')])
            ->orderBy('title')
            ->get();
    }

    /**
     * Get a book request by ID with relationships
     */
    public function getBookRequest(int $id): BookRequest
    {
        return BookRequest::with([
            'member',
            'catalogItem.authors',
            'catalogItem.publisher',
            'catalogItemCopy',
        ])->findOrFail($id);
    }

    /**
     * Update a book request
     * 
     * @throws \Exception if update fails
     */
    public function update(int $id, array $data): BookRequest
    {
        $bookRequest = BookRequest::with([
            'catalogItem.authors',
            'catalogItem.publisher',
            'catalogItemCopy',
        ])->findOrFail($id);

        $oldStatus = $bookRequest->status;
        $oldReturnDate = $bookRequest->return_date;
        $oldReturnTime = $bookRequest->return_time;

        // Check for blocked operations
        $this->validateStatusChange($bookRequest, $oldStatus, $data['status']);

        // Update the book request
        $bookRequest->update($data);

        $statusChanged = $oldStatus !== $data['status'];
        $dateTimeChanged = ($oldReturnDate !== $data['return_date'] || $oldReturnTime !== $data['return_time']) 
                           && $data['status'] === 'Approved';

        // Handle status changes
        if ($statusChanged) {
            if ($data['status'] === 'Approved') {
                $this->handleApproval($bookRequest, $oldStatus);
            } elseif ($data['status'] === 'Disapproved') {
                $this->handleDisapproval($bookRequest, $oldStatus);
            }
        }

        // Handle date/time changes for already approved requests
        if ($dateTimeChanged && !$statusChanged) {
            $this->scheduleDueDateReminder($bookRequest);
        }

        return $bookRequest;
    }

    /**
     * Approve a book request
     * 
     * @throws \Exception if approval fails
     */
    public function approve(int $id): BookRequest
    {
        $bookRequest = BookRequest::with([
            'catalogItem.copies',
            'catalogItem.authors',
            'catalogItem.publisher',
            'catalogItemCopy',
        ])->findOrFail($id);

        // Validate copy availability
        if ($bookRequest->catalogItemCopy && $bookRequest->catalogItemCopy->status === 'Borrowed') {
            throw new \Exception('This copy is already borrowed and cannot be approved.');
        }

        // Find available copy if none selected
        if (!$bookRequest->catalog_item_copy_id) {
            $availableCopy = $bookRequest->catalogItem->copies()->where('status', 'Available')->first();
            
            if (!$availableCopy) {
                throw new \Exception('No available copies for this title.');
            }
            
            $bookRequest->update(['catalog_item_copy_id' => $availableCopy->id]);
            $bookRequest->load('catalogItemCopy');
        }

        // Approve the request
        $bookRequest->update(['status' => 'Approved']);

        // Mark copy as borrowed
        if ($bookRequest->catalogItemCopy) {
            $bookRequest->catalogItemCopy->update(['status' => 'Borrowed']);
        }

        // Send email and schedule reminder
        Mail::to($bookRequest->email)->send(new BookRequestApproved($bookRequest));
        $this->scheduleDueDateReminder($bookRequest);

        return $bookRequest;
    }

    /**
     * Disapprove a book request
     * 
     * @throws \Exception if disapproval fails
     */
    public function disapprove(int $id): BookRequest
    {
        $bookRequest = BookRequest::with([
            'catalogItem.authors',
            'catalogItem.publisher',
            'catalogItemCopy',
        ])->findOrFail($id);

        // Validate
        if ($bookRequest->status === 'Pending' && 
            $bookRequest->catalogItemCopy && 
            $bookRequest->catalogItemCopy->status === 'Borrowed') {
            throw new \Exception('This copy is already borrowed and cannot be declined.');
        }

        // If previously approved, release the copy
        if ($bookRequest->status === 'Approved' && $bookRequest->catalogItemCopy) {
            $bookRequest->catalogItemCopy->update(['status' => 'Available']);
        }

        $bookRequest->update(['status' => 'Disapproved']);

        // Send disapproval email
        Mail::to($bookRequest->email)->send(new BookRequestDisapproved($bookRequest));

        return $bookRequest;
    }

    /**
     * Store a new approved book request (admin/staff use)
     * 
     * @throws \Exception if store fails
     */
    public function storeApproved(array $data): BookRequest
    {
        $member = Member::where('member_no', $data['member_id'])->first();
        if (!$member) {
            throw new \Exception('Member not found.');
        }

        $copy = CatalogItemCopy::find($data['catalog_item_copy_id']);
        if (!$copy || $copy->status !== 'Available') {
            throw new \Exception('This copy is not available for borrowing.');
        }

        // Create the book request
        $bookRequest = BookRequest::create([
            'member_id' => $member->id,
            'catalog_item_id' => $data['catalog_item_id'],
            'catalog_item_copy_id' => $data['catalog_item_copy_id'],
            'full_name' => $member->name,
            'email' => $member->email ?? '',
            'quota' => $member->booking_quota,
            'phone' => $member->phone,
            'address' => $data['address'] ?? null,
            'return_date' => $data['return_date'],
            'return_time' => $data['return_time'],
            'notes' => $data['notes'] ?? null,
            'status' => 'Approved',
        ]);

        // Mark copy as borrowed
        $copy->update(['status' => 'Borrowed']);

        // Load relationships for email
        $bookRequest->load([
            'catalogItem.authors',
            'catalogItem.publisher',
            'catalogItemCopy',
        ]);

        // Send email and schedule reminder (non-blocking - don't fail if email fails)
        try {
            if ($bookRequest->email) {
                Mail::to($bookRequest->email)->send(new BookRequestApproved($bookRequest));
                $this->scheduleDueDateReminder($bookRequest);
            }
        } catch (\Exception $e) {
            // Log the error but don't fail the borrow operation
            \Log::warning('Failed to send borrow approval email: ' . $e->getMessage());
        }

        return $bookRequest;
    }

    /**
     * Delete a book request
     */
    public function delete(int $id): void
    {
        $bookRequest = BookRequest::findOrFail($id);
        $bookRequest->delete();
    }

    /**
     * Get data for borrow catalog page
     */
    public function getBorrowCatalogData(): array
    {
        return [
            'catalogItems' => $this->getCatalogItemsForBorrowing(),
            'authors' => Author::select('id', 'name')->orderBy('name')->get(),
            'publishers' => Publisher::select('id', 'name')->orderBy('name')->get(),
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ];
    }

    /**
     * Get catalog item with copies for available copies page
     */
    public function getCatalogItemWithCopies(CatalogItem $catalogItem): CatalogItem
    {
        $catalogItem->load([
            'category:id,name',
            'publisher:id,name',
            'authors:id,name',
            'copies' => fn($q) => $q->select('id', 'catalog_item_id', 'copy_no', 'accession_no', 'status', 'branch', 'location')
                                    ->orderBy('copy_no'),
        ]);

        $catalogItem->loadCount('copies');
        $catalogItem->loadCount(['copies as available_copies_count' => fn($q) => $q->where('status', 'Available')]);

        return $catalogItem;
    }

    /**
     * Validate status change operation
     */
    private function validateStatusChange(BookRequest $bookRequest, string $oldStatus, string $newStatus): void
    {
        if ($oldStatus === 'Pending' && 
            in_array($newStatus, ['Approved', 'Disapproved']) &&
            $bookRequest->catalogItemCopy && 
            $bookRequest->catalogItemCopy->status === 'Borrowed') {
            throw new \Exception('This copy is already borrowed and cannot be approved or declined.');
        }
    }

    /**
     * Handle approval logic
     */
    private function handleApproval(BookRequest $bookRequest, string $oldStatus): void
    {
        // Find available copy if none selected
        if (!$bookRequest->catalog_item_copy_id) {
            $bookRequest->load('catalogItem.copies');
            $availableCopy = $bookRequest->catalogItem->copies()->where('status', 'Available')->first();

            if ($availableCopy) {
                $bookRequest->update(['catalog_item_copy_id' => $availableCopy->id]);
                $bookRequest->load('catalogItemCopy');
            } else {
                $bookRequest->update(['status' => $oldStatus]);
                throw new \Exception('No available copies for this title.');
            }
        }

        // Mark copy as borrowed
        if ($bookRequest->catalogItemCopy) {
            $bookRequest->catalogItemCopy->update(['status' => 'Borrowed']);
        }

        // Send email and schedule reminder
        Mail::to($bookRequest->email)->send(new BookRequestApproved($bookRequest));
        $this->scheduleDueDateReminder($bookRequest);
    }

    /**
     * Handle disapproval logic
     */
    private function handleDisapproval(BookRequest $bookRequest, string $oldStatus): void
    {
        // If previously approved, release the copy
        if ($oldStatus === 'Approved' && $bookRequest->catalogItemCopy) {
            $bookRequest->catalogItemCopy->update(['status' => 'Available']);
        }

        // Send disapproval email
        Mail::to($bookRequest->email)->send(new BookRequestDisapproved($bookRequest));
    }

    /**
     * Schedule or reschedule due-date reminder
     */
    private function scheduleDueDateReminder(BookRequest $bookRequest): void
    {
        $returnDateOnly = Carbon::parse($bookRequest->return_date)->format('Y-m-d');
        $scheduledDateTime = Carbon::parse($returnDateOnly . ' ' . $bookRequest->return_time);

        $emailData = [
            'email' => $bookRequest->email,
            'return_date' => $scheduledDateTime->format('F j, Y'),
            'return_time' => $scheduledDateTime->format('g:i A'),
            'scheduled_at' => $scheduledDateTime->toDateTimeString(),
        ];

        // Delete existing scheduled jobs for this email
        DB::table('jobs')
            ->where('queue', 'default')
            ->where('payload', 'like', '%"email":"' . $bookRequest->email . '"%')
            ->where('payload', 'like', '%SendBookDueReminderEmail%')
            ->delete();

        // Schedule new reminder
        if ($scheduledDateTime->isFuture()) {
            SendBookDueReminderEmail::dispatch($bookRequest->email, $emailData)->delay($scheduledDateTime);
        } else {
            SendBookDueReminderEmail::dispatch($bookRequest->email, $emailData);
        }
    }
}
