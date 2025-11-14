<?php

use App\Http\Controllers\Admin\EmailReminderController;
use App\Http\Controllers\Admin\QrScannerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\Shared\AIChatController;
use App\Http\Controllers\Shared\DashboardController;
use App\Http\Controllers\Shared\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Setup route - creates admin account
Route::get('/setup-admin', [SetupController::class, 'createAdmin']);

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Shared authenticated routes (both admin and staff)
Route::middleware(['auth', 'verified'])->group(function () {
    // Unified dashboard route - displays different views based on role
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // AI Chat
    Route::post('/ai/chat', [AIChatController::class, 'chat'])->name('ai.chat');
    Route::get('/ai/conversations', [AIChatController::class, 'conversations'])->name('ai.conversations');
    Route::get('/ai/conversations/{id}', [AIChatController::class, 'getConversation'])->name('ai.conversations.get');
    Route::post('/ai/conversations', [AIChatController::class, 'saveConversation'])->name('ai.conversations.save');
    Route::delete('/ai/conversations/{id}', [AIChatController::class, 'deleteConversation'])->name('ai.conversations.delete');
});

// Admin-only routes (without URL prefix, but protected by role middleware)
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    
    // QR Scanner
    Route::get('/qr-scanner', [QrScannerController::class, 'index'])->name('qr-scanner');
    
    // Email Reminder
    Route::get('/email-reminder', [EmailReminderController::class, 'index'])->name('email-reminder');
    Route::post('/email-reminder/send', [EmailReminderController::class, 'send'])->name('email-reminder.send');
});

require __DIR__.'/auth.php';
