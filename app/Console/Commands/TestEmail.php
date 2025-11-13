<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookDueReminder;

class TestEmail extends Command
{
    protected $signature = 'test:email {email}';
    protected $description = 'Send a test email to verify email configuration';

    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info('Testing email configuration...');
        $this->info('Sending to: ' . $email);
        
        try {
            $emailData = [
                'email' => $email,
                'return_date' => 'November 10, 2025',
                'return_time' => '2:00 PM',
                'scheduled_at' => now()->toDateTimeString(),
            ];
            
            Mail::to($email)->send(new BookDueReminder($emailData));
            
            $this->info('✅ Email sent successfully!');
            $this->info('Check your inbox at: ' . $email);
            
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send email!');
            $this->error('Error: ' . $e->getMessage());
            
            return 1;
        }
    }
}

