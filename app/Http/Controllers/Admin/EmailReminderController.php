<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmailReminderRequest;
use App\Jobs\SendBookDueReminderEmail;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class EmailReminderController extends Controller
{
    /**
     * Display the email reminder page
     */
    public function index(): Response
    {
        return Inertia::render('admin/EmailReminder');
    }

    /**
     * Send/Schedule the email reminder
     */
    public function send(EmailReminderRequest $request)
    {
        $validated = $request->validated();

        try {
            // Combine date and time
            $scheduledDateTime = Carbon::parse($validated['return_date'] . ' ' . $validated['return_time']);
            $now = Carbon::now();

            // Prepare email data
            $emailData = [
                'email' => $validated['email'],
                'return_date' => $scheduledDateTime->format('F j, Y'),
                'return_time' => $scheduledDateTime->format('g:i A'),
                'scheduled_at' => $scheduledDateTime->toDateTimeString(),
            ];

            // Check if scheduled time is in the future
            if ($scheduledDateTime->isFuture()) {
                // Dispatch job with delay (scheduled for future)
                SendBookDueReminderEmail::dispatch($validated['email'], $emailData)
                    ->delay($scheduledDateTime);

                return back()->with('success', 'Email reminder scheduled successfully! Will be sent on ' . $scheduledDateTime->format('M j, Y \a\t g:i A'));
            } else {
                // Dispatch immediately if the date/time is in the past or now
                SendBookDueReminderEmail::dispatch($validated['email'], $emailData);

                return back()->with('success', 'Email reminder sent successfully! (Date was in the past)');
            }

        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'Failed to schedule email. Please check the email address and try again.'
            ]);
        }
    }
}


