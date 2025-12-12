<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command("inspire", function () {
    $this->comment(Inspiring::quote());
})->purpose("Display an inspiring quote");

// Schedule the overdue books check to run daily at 8:00 AM
Schedule::command("books:check-overdue")->dailyAt("08:00");

// Also run every hour during business hours (9 AM - 5 PM) for more timely notifications
Schedule::command("books:check-overdue")
    ->hourly()
    ->between("09:00", "17:00")
    ->weekdays();
