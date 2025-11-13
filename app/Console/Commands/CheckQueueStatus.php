<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckQueueStatus extends Command
{
    protected $signature = 'queue:check';
    protected $description = 'Check queue status and diagnose email sending issues';

    public function handle()
    {
        $this->info('=== Queue Diagnostics ===');
        $this->newLine();

        $this->info('1. Database Connection:');
        try {
            $dbName = DB::connection()->getDatabaseName();
            $this->line("   ✓ Connected to: {$dbName}");
        } catch (\Exception $e) {
            $this->error("   ✗ Database connection failed: " . $e->getMessage());
            return 1;
        }

        $this->newLine();
        $this->info('2. Queue Configuration:');
        $this->line('   Default Connection: ' . config('queue.default'));
        $this->line('   Queue Table: ' . config('queue.connections.database.table'));

        $this->newLine();
        $this->info('3. Jobs in Queue:');
        $jobCount = DB::table('jobs')->count();
        $this->line("   Total Jobs: {$jobCount}");

        if ($jobCount > 0) {
            $jobs = DB::table('jobs')
                ->select('id', 'queue', 'attempts', 'available_at', 'created_at')
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get();

            $this->table(
                ['ID', 'Queue', 'Attempts', 'Available At', 'Created At'],
                $jobs->map(function ($job) {
                    return [
                        $job->id,
                        $job->queue,
                        $job->attempts,
                        date('Y-m-d H:i:s', $job->available_at),
                        date('Y-m-d H:i:s', $job->created_at),
                    ];
                })
            );

            $now = time();
            $readyJobs = DB::table('jobs')->where('available_at', '<=', $now)->count();
            $this->line("   Jobs ready to process now: {$readyJobs}");
            $this->line("   Jobs scheduled for later: " . ($jobCount - $readyJobs));
        }

        $this->newLine();
        $this->info('4. Failed Jobs:');
        $failedCount = DB::table('failed_jobs')->count();
        $this->line("   Total Failed: {$failedCount}");

        if ($failedCount > 0) {
            $failed = DB::table('failed_jobs')
                ->select('id', 'connection', 'queue', 'failed_at')
                ->orderBy('failed_at', 'desc')
                ->limit(3)
                ->get();

            $this->table(
                ['ID', 'Connection', 'Queue', 'Failed At'],
                $failed->map(fn($f) => [$f->id, $f->connection, $f->queue, $f->failed_at])
            );
        }

        $this->newLine();
        $this->info('5. Mail Configuration:');
        $this->line('   Mailer: ' . config('mail.default'));
        $this->line('   From: ' . config('mail.from.address'));
        $this->line('   Host: ' . config('mail.mailers.smtp.host'));
        $this->line('   Port: ' . config('mail.mailers.smtp.port'));

        $this->newLine();
        $this->info('✓ Diagnostics complete');

        return 0;
    }
}
