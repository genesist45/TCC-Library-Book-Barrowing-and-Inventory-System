<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BookLikeController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\Shared\BookSearchController;
use App\Http\Controllers\Shared\DashboardController;
use App\Http\Controllers\Shared\NotificationController;
use App\Http\Controllers\Shared\ProfileController;
use App\Http\Controllers\Shared\PublicPageController;
use App\Http\Controllers\Shared\ReportsController;
use App\Http\Controllers\Shared\Catalog\AuthorController;
use App\Http\Controllers\Shared\Catalog\CategoryController;
use App\Http\Controllers\Shared\Catalog\CatalogItemController;
use App\Http\Controllers\Shared\Catalog\CatalogItemCopyController;
use App\Http\Controllers\Shared\Catalog\PublisherController;
use App\Http\Controllers\Shared\Circulation\BookRequestController;
use App\Http\Controllers\Shared\Circulation\BookReturnController;
use App\Http\Controllers\Shared\Members\MemberController;
use App\Http\Controllers\Shared\Tools\EmailReminderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/setup-admin', [SetupController::class, 'createAdmin']);

// Public Pages
Route::get('/', [PublicPageController::class, 'welcome']);
Route::get('/about', [PublicPageController::class, 'about'])->name('about');
Route::get('/contact', [PublicPageController::class, 'contact'])->name('contact');

// Public Book Routes
Route::get('/books/search', [BookSearchController::class, 'search'])->name('books.search');
Route::get('/books/{id}', [BookSearchController::class, 'show'])->name('books.show');
Route::get('/books/{id}/borrow', [BookSearchController::class, 'createBorrowRequest'])->name('books.borrow-request.create');
Route::post('/books/borrow-request', [BookSearchController::class, 'storeBorrowRequest'])->name('books.borrow-request.store');
Route::post('/books/{catalogItem}/like', [BookLikeController::class, 'toggle'])->name('books.like.toggle');
Route::get('/books/{catalogItem}/like-status', [BookLikeController::class, 'status'])->name('books.like.status');

// Public API Endpoints
Route::get('/api/catalog-items/{id}', [BookSearchController::class, 'getBookDetails'])->name('api.catalog-items.show');
Route::get('/api/members/{memberNo}', [MemberController::class, 'findByMemberNo']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES (All Users)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/chart-data', [DashboardController::class, 'getChartData'])->name('admin.dashboard.chart-data');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::post('/notifications/check-overdue', [NotificationController::class, 'checkOverdue'])->name('notifications.check-overdue');
});

/*
|--------------------------------------------------------------------------
| ADMIN-ONLY ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

/*
|--------------------------------------------------------------------------
| ADMIN & STAFF ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:admin|staff'])->group(function () {
    // Tools
    Route::get('/email-reminder', [EmailReminderController::class, 'index'])->name('email-reminder');
    Route::post('/email-reminder/send', [EmailReminderController::class, 'send'])->name('email-reminder.send');

    // Admin Panel Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Catalog Management
        Route::resource('categories', CategoryController::class)->except(['create', 'edit']);
        Route::resource('authors', AuthorController::class)->except(['create', 'edit']);
        Route::resource('publishers', PublisherController::class)->except(['create', 'edit']);
        Route::post('catalog-items/validate', [CatalogItemController::class, 'validateForReview'])->name('catalog-items.validate');
        Route::resource('catalog-items', CatalogItemController::class);

        // Catalog Copies
        Route::post('catalog-items/{catalogItem}/copies', [CatalogItemCopyController::class, 'store'])->name('catalog-items.copies.store');
        Route::post('catalog-items/{catalogItem}/copies/bulk', [CatalogItemCopyController::class, 'storeBulk'])->name('catalog-items.copies.store-bulk');
        Route::get('copies/generate-accession-no', [CatalogItemCopyController::class, 'generateAccessionNo'])->name('copies.generate-accession-no');
        Route::get('copies/next-accession', [CatalogItemCopyController::class, 'nextAccessionNo'])->name('copies.next-accession');
        Route::post('copies/validate-accession-no', [CatalogItemCopyController::class, 'validateAccessionNo'])->name('copies.validate-accession-no');
        Route::put('copies/{copy}', [CatalogItemCopyController::class, 'update'])->name('copies.update');
        Route::delete('copies/{copy}', [CatalogItemCopyController::class, 'destroy'])->name('copies.destroy');
        Route::get('copies/{copy}/borrow-history', [CatalogItemCopyController::class, 'borrowHistory'])->name('copies.borrow-history');

        // Members
        Route::get('members/search', [MemberController::class, 'search'])->name('members.search');
        Route::resource('members', MemberController::class);

        // Book Requests (Circulation)
        Route::post('book-requests/{id}/approve', [BookRequestController::class, 'approve'])->name('book-requests.approve');
        Route::post('book-requests/{id}/disapprove', [BookRequestController::class, 'disapprove'])->name('book-requests.disapprove');
        Route::post('book-requests/store-approved', [BookRequestController::class, 'storeApproved'])->name('book-requests.store-approved');
        Route::get('book-requests/borrow-catalog', [BookRequestController::class, 'borrowCatalog'])->name('book-requests.borrow-catalog');
        Route::get('book-requests/available-copies/{catalogItem}', [BookRequestController::class, 'availableCopies'])->name('book-requests.available-copies');
        Route::resource('book-requests', BookRequestController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);

        // Book Returns
        Route::resource('book-returns', BookReturnController::class);

        // Reports
        Route::get('reports/catalog', [ReportsController::class, 'catalog'])->name('reports.catalog');
        Route::get('reports/circulation', [ReportsController::class, 'circulation'])->name('reports.circulation');
        Route::get('reports/overdue', [ReportsController::class, 'overdue'])->name('reports.overdue');
    });
});

require __DIR__ . '/auth.php';
