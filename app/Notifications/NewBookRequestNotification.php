<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookRequestNotification extends Notification
{
    use Queueable;

    protected $bookRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct($bookRequest)
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
        return [
            'message' => 'New book request submitted',
            'member_name' => $this->bookRequest->member->name,
            'book_title' => $this->bookRequest->catalogItem->title,
            'request_id' => $this->bookRequest->id,
            'action_url' => route('admin.book-requests.index'),
        ];
    }
}
