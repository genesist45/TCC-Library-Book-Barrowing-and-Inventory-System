<?php

use App\Http\Controllers\Admin\AuthorController;
use App\Http\Controllers\Admin\BookRequestController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CatalogItemController;
use App\Http\Controllers\Admin\EmailReminderController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\PublisherController;
use App\Http\Controllers\Admin\QrScannerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\Shared\AIChatController;
use App\Http\Controllers\Shared\BookSearchController;
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

// Public book search routes
Route::get('/books/search', [BookSearchController::class, 'search'])->name('books.search');
Route::get('/books/{id}', [BookSearchController::class, 'show'])->name('books.show');
Route::get('/books/{id}/borrow', [BookSearchController::class, 'createBorrowRequest'])->name('books.borrow-request.create');
Route::post('/books/borrow-request', [BookSearchController::class, 'storeBorrowRequest'])->name('books.borrow-request.store');



// API endpoint for member lookup by member number
Route::get('/api/members/{memberNo}', function ($memberNo) {
    $member = \App\Models\Member::where('member_no', $memberNo)->first();
    if (!$member) {
        return response()->json(['error' => 'Member not found'], 404);
    }
    return response()->json($member);
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
    
    // Category Management
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('categories', CategoryController::class)->except(['create', 'edit']);
        Route::resource('authors', AuthorController::class)->except(['create', 'edit']);
        Route::resource('publishers', PublisherController::class)->except(['create', 'edit']);
        Route::resource('catalog-items', CatalogItemController::class);
        Route::resource('members', MemberController::class);
        
        // Book Requests (Circulations)
        Route::post('book-requests/{id}/approve', [BookRequestController::class, 'approve'])->name('book-requests.approve');
        Route::post('book-requests/{id}/disapprove', [BookRequestController::class, 'disapprove'])->name('book-requests.disapprove');
        Route::resource('book-requests', BookRequestController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);
    });
});

require __DIR__.'/auth.php';
