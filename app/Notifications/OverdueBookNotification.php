<?php

namespace App\Notifications;

use App\Models\BookRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OverdueBookNotification extends Notification
{
    use Queueable;

    protected BookRequest $bookRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(BookRequest $bookRequest)
    {
        $this->bookRequest = $bookRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $member = $this->bookRequest->member;
        $catalogItem = $this->bookRequest->catalogItem;
        $dueDate = $this->bookRequest->return_date?->format('M d, Y') ?? 'N/A';

        return [
            'type' => 'overdue_book',
            'message' => 'Overdue book alert',
            'description' => "Book is overdue since {$dueDate}",
            'member_id' => $member?->id,
            'member_name' => $member?->name ?? $this->bookRequest->full_name ?? 'Unknown Member',
            'member_no' => $member?->member_no ?? 'N/A',
            'book_title' => $catalogItem?->title ?? 'Unknown Book',
            'book_id' => $catalogItem?->id,
            'accession_no' => $catalogItem?->accession_no ?? 'N/A',
            'request_id' => $this->bookRequest->id,
            'due_date' => $dueDate,
            'days_overdue' => $this->bookRequest->return_date
                ? now()->diffInDays($this->bookRequest->return_date)
                : 0,
            'action_url' => $member
                ? route('admin.members.show', ['member' => $member->id, 'tab' => 'borrow-history'])
                : route('admin.book-requests.index'),
        ];
    }
}
