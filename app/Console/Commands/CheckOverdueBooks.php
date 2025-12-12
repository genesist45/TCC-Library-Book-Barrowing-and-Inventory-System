<?php

namespace App\Console\Commands;

use App\Models\BookRequest;
use App\Models\User;
use App\Notifications\OverdueBookNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class CheckOverdueBooks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'books:check-overdue {--force : Force send notifications even if already sent}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for overdue books and send notifications to admins';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Checking for overdue books...');

        // Find all overdue book requests that haven't been returned
        $overdueRequests = BookRequest::with(['member', 'catalogItem', 'bookReturn'])
            ->where('status', 'Approved')
            ->whereDate('return_date', '<', Carbon::today())
            ->whereDoesntHave('bookReturn')
            ->get();

        if ($overdueRequests->isEmpty()) {
            $this->info('No overdue books found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$overdueRequests->count()} overdue book(s).");

        // Get all admin users
        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            $this->warn('No admin users found to notify.');
            return Command::SUCCESS;
        }

        $notificationsSent = 0;
        $force = $this->option('force');

        foreach ($overdueRequests as $request) {
            // Check if notification was already sent for this request (to avoid duplicates)
            if (!$force && $this->notificationAlreadySent($request, $admins)) {
                $this->line("  - Skipping: Notification already sent for request #{$request->id}");
                continue;
            }

            // Send notification to all admins
            Notification::send($admins, new OverdueBookNotification($request));

            $memberName = $request->member?->name ?? $request->full_name ?? 'Unknown';
            $bookTitle = $request->catalogItem?->title ?? 'Unknown';
            $daysOverdue = Carbon::today()->diffInDays($request->return_date);

            $this->info("  - Notified: {$memberName} - \"{$bookTitle}\" ({$daysOverdue} days overdue)");
            $notificationsSent++;
        }

        $this->newLine();
        $this->info("Sent {$notificationsSent} notification(s) to {$admins->count()} admin(s).");

        return Command::SUCCESS;
    }

    /**
     * Check if a notification was already sent for this request today.
     */
    private function notificationAlreadySent(BookRequest $request, $admins): bool
    {
        // Check if any admin already has a notification for this request today
        $firstAdmin = $admins->first();

        if (!$firstAdmin) {
            return false;
        }

        return $firstAdmin->notifications()
            ->where('type', OverdueBookNotification::class)
            ->whereDate('created_at', Carbon::today())
            ->whereJsonContains('data->request_id', $request->id)
            ->exists();
    }
}
