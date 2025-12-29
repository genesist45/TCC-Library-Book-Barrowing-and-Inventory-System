<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\BookRequest;
use App\Models\User;
use App\Notifications\OverdueBookNotification;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

/**
 * Controller for handling user notifications
 * Handles marking as read, deleting, and checking for overdue books
 */
class NotificationController extends Controller
{
    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $request->user()->notifications()->findOrFail($id)->markAsRead();
        
        return back();
    }

    /**
     * Delete a specific notification
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $request->user()->notifications()->findOrFail($id)->delete();
        
        return back();
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications->markAsRead();
        
        return back();
    }

    /**
     * Check for overdue books and send notifications to admin/staff
     */
    public function checkOverdue(): RedirectResponse
    {
        $overdueRequests = BookRequest::with([
            'member',
            'catalogItem',
            'bookReturn',
        ])
            ->where('status', 'Approved')
            ->whereDate('return_date', '<', Carbon::today())
            ->whereDoesntHave('bookReturn')
            ->get();

        if ($overdueRequests->isEmpty()) {
            return back()->with('info', 'No overdue books found.');
        }

        $usersToNotify = User::whereIn('role', ['admin', 'staff'])->get();

        if ($usersToNotify->isEmpty()) {
            return back()->with('error', 'No admin or staff users found to notify.');
        }

        $notificationsSent = 0;
        
        foreach ($overdueRequests as $request) {
            // Check if notification was already sent today
            $alreadySent = $usersToNotify
                ->first()
                ->notifications()
                ->where('type', OverdueBookNotification::class)
                ->whereDate('created_at', Carbon::today())
                ->whereJsonContains('data->request_id', $request->id)
                ->exists();

            if (!$alreadySent) {
                Notification::send(
                    $usersToNotify,
                    new OverdueBookNotification($request)
                );
                $notificationsSent++;
            }
        }

        if ($notificationsSent > 0) {
            return back()->with(
                'success',
                "Sent {$notificationsSent} overdue notification(s)."
            );
        }

        return back()->with(
            'info',
            'All overdue notifications have already been sent today.'
        );
    }
}
