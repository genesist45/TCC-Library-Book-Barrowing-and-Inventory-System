<?php

namespace App\Jobs;

use App\Mail\BookDueReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendBookDueReminderEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;
    public $maxExceptions = 3;
    
    // Force each job to be unique - allows duplicate emails
    public $uniqueId;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $email,
        public array $emailData
    ) {
        // Generate unique ID for each job (allows same email multiple times)
        $this->uniqueId = uniqid('email_reminder_', true);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->email)->send(new BookDueReminder($this->emailData));
            
            Log::info('Email reminder sent successfully', [
                'job_id' => $this->uniqueId,
                'email' => $this->email,
                'scheduled_for' => $this->emailData['scheduled_at'],
                'sent_at' => now()->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send email reminder', [
                'job_id' => $this->uniqueId,
                'email' => $this->email,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Email reminder job failed after all retries', [
            'job_id' => $this->uniqueId,
            'email' => $this->email,
            'error' => $exception->getMessage(),
            'failed_at' => now()->toDateTimeString(),
        ]);
    }
    
    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        return ['email_reminder', 'email:' . $this->email, 'job:' . $this->uniqueId];
    }
}

