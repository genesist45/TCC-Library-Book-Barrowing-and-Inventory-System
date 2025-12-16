<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\Shared\AIChatController;
use App\Http\Controllers\Shared\BookSearchController;
use App\Http\Controllers\Shared\DashboardController;
use App\Http\Controllers\Shared\ProfileController;
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
use Inertia\Inertia;

// Setup route - creates admin account
Route::get("/setup-admin", [SetupController::class, "createAdmin"]);

Route::get("/", function () {
    $popularBooks = \App\Models\CatalogItem::with([
        "category",
        "publisher",
        "authors",
        "copies",
    ])
        ->withCount("copies")
        ->withCount([
            "copies as available_copies_count" => function ($query) {
                $query->where("status", "Available");
            },
        ])
        ->where("is_active", true)
        ->latest()
        ->take(10)
        ->get();

    return Inertia::render("Welcome", [
        "popularBooks" => $popularBooks,
    ]);
});

// About Us page
Route::get("/about", function () {
    return Inertia::render("About");
})->name("about");

// Contact Us page
Route::get("/contact", function () {
    return Inertia::render("Contact");
})->name("contact");

// Public book search routes
Route::get("/books/search", [BookSearchController::class, "search"])->name(
    "books.search",
);
Route::get("/books/{id}", [BookSearchController::class, "show"])->name(
    "books.show",
);
Route::get("/books/{id}/borrow", [
    BookSearchController::class,
    "createBorrowRequest",
])->name("books.borrow-request.create");
Route::post("/books/borrow-request", [
    BookSearchController::class,
    "storeBorrowRequest",
])->name("books.borrow-request.store");

// API endpoint for getting catalog item details (for modal)
Route::get("/api/catalog-items/{id}", [
    BookSearchController::class,
    "getBookDetails",
])->name("api.catalog-items.show");

// Book like routes
Route::post("/books/{catalogItem}/like", [\App\Http\Controllers\BookLikeController::class, "toggle"])->name("books.like.toggle");
Route::get("/books/{catalogItem}/like-status", [\App\Http\Controllers\BookLikeController::class, "status"])->name("books.like.status");

// API endpoint for member lookup by member number
Route::get("/api/members/{memberNo}", function ($memberNo) {
    $member = \App\Models\Member::where("member_no", $memberNo)->first();
    if (!$member) {
        return response()->json(["error" => "Member not found"], 404);
    }
    return response()->json($member);
});

// Shared authenticated routes (both admin and staff)
Route::middleware(["auth", "verified"])->group(function () {
    // Unified dashboard route - displays different views based on role
    Route::get("/dashboard", [DashboardController::class, "index"])->name(
        "dashboard",
    );

    // Dashboard chart data API
    Route::get("/dashboard/chart-data", [DashboardController::class, "getChartData"])->name(
        "admin.dashboard.chart-data",
    );

    // Profile routes
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit",
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update",
    );
    Route::post("/profile/avatar", [
        ProfileController::class,
        "uploadAvatar",
    ])->name("profile.avatar.upload");
    Route::delete("/profile/avatar", [
        ProfileController::class,
        "removeAvatar",
    ])->name("profile.avatar.remove");
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy",
    );

    // AI Chat
    Route::post("/ai/chat", [AIChatController::class, "chat"])->name("ai.chat");
    Route::get("/ai/conversations", [
        AIChatController::class,
        "conversations",
    ])->name("ai.conversations");
    Route::get("/ai/conversations/{id}", [
        AIChatController::class,
        "getConversation",
    ])->name("ai.conversations.get");
    Route::post("/ai/conversations", [
        AIChatController::class,
        "saveConversation",
    ])->name("ai.conversations.save");
    Route::delete("/ai/conversations/{id}", [
        AIChatController::class,
        "deleteConversation",
    ])->name("ai.conversations.delete");

    // Notifications
    Route::post("/notifications/{id}/read", function ($id) {
        request()->user()->notifications()->findOrFail($id)->markAsRead();
        return back();
    })->name("notifications.read");

    Route::delete("/notifications/{id}", function ($id) {
        request()->user()->notifications()->findOrFail($id)->delete();
        return back();
    })->name("notifications.destroy");

    Route::post("/notifications/read-all", function () {
        request()->user()->unreadNotifications->markAsRead();
        return back();
    })->name("notifications.read-all");

    // Check for overdue books and send notifications
    Route::post("/notifications/check-overdue", function () {
        $overdueRequests = \App\Models\BookRequest::with([
            "member",
            "catalogItem",
            "bookReturn",
        ])
            ->where("status", "Approved")
            ->whereDate("return_date", "<", \Carbon\Carbon::today())
            ->whereDoesntHave("bookReturn")
            ->get();

        if ($overdueRequests->isEmpty()) {
            return back()->with("info", "No overdue books found.");
        }

        $usersToNotify = \App\Models\User::whereIn("role", ["admin", "staff"])->get();

        if ($usersToNotify->isEmpty()) {
            return back()->with("error", "No admin or staff users found to notify.");
        }

        $notificationsSent = 0;
        foreach ($overdueRequests as $request) {
            // Check if notification was already sent today
            $alreadySent = $usersToNotify
                ->first()
                ->notifications()
                ->where(
                    "type",
                    \App\Notifications\OverdueBookNotification::class,
                )
                ->whereDate("created_at", \Carbon\Carbon::today())
                ->whereJsonContains("data->request_id", $request->id)
                ->exists();

            if (!$alreadySent) {
                \Illuminate\Support\Facades\Notification::send(
                    $usersToNotify,
                    new \App\Notifications\OverdueBookNotification($request),
                );
                $notificationsSent++;
            }
        }

        if ($notificationsSent > 0) {
            return back()->with(
                "success",
                "Sent {$notificationsSent} overdue notification(s).",
            );
        }

        return back()->with(
            "info",
            "All overdue notifications have already been sent today.",
        );
    })->name("notifications.check-overdue");
});

// Admin-only routes (Users management - only admins can access)
Route::middleware(["auth", "verified", "role:admin"])->group(function () {
    Route::get("/users", [UserController::class, "index"])->name("users.index");
    Route::post("/users", [UserController::class, "store"])->name(
        "users.store",
    );
    Route::patch("/users/{user}", [UserController::class, "update"])->name(
        "users.update",
    );
    Route::delete("/users/{user}", [UserController::class, "destroy"])->name(
        "users.destroy",
    );
});

// Admin and Staff shared routes (all administrative functions except user management)
Route::middleware(["auth", "verified", "role:admin|staff"])->group(function () {
    // Email Reminder
    Route::get("/email-reminder", [
        EmailReminderController::class,
        "index",
    ])->name("email-reminder");
    Route::post("/email-reminder/send", [
        EmailReminderController::class,
        "send",
    ])->name("email-reminder.send");

    // Category Management
    Route::prefix("admin")
        ->name("admin.")
        ->group(function () {
            Route::resource("categories", CategoryController::class)->except([
                "create",
                "edit",
            ]);
            Route::resource("authors", AuthorController::class)->except([
                "create",
                "edit",
            ]);
            Route::resource("publishers", PublisherController::class)->except([
                "create",
                "edit",
            ]);
            Route::post("catalog-items/validate", [CatalogItemController::class, "validateForReview"])->name("catalog-items.validate");
            Route::resource("catalog-items", CatalogItemController::class);
            Route::resource("members", MemberController::class);

            // Catalog Item Copies
            Route::post("catalog-items/{catalogItem}/copies", [
                CatalogItemCopyController::class,
                "store",
            ])->name("catalog-items.copies.store");
            Route::post("catalog-items/{catalogItem}/copies/bulk", [
                CatalogItemCopyController::class,
                "storeBulk",
            ])->name("catalog-items.copies.store-bulk");
            Route::get("copies/generate-accession-no", [
                CatalogItemCopyController::class,
                "generateAccessionNo",
            ])->name("copies.generate-accession-no");
            Route::get("copies/next-accession", [
                CatalogItemCopyController::class,
                "nextAccessionNo",
            ])->name("copies.next-accession");
            Route::post("copies/validate-accession-no", [
                CatalogItemCopyController::class,
                "validateAccessionNo",
            ])->name("copies.validate-accession-no");
            Route::put("copies/{copy}", [
                CatalogItemCopyController::class,
                "update",
            ])->name("copies.update");
            Route::delete("copies/{copy}", [
                CatalogItemCopyController::class,
                "destroy",
            ])->name("copies.destroy");
            Route::get("copies/{copy}/borrow-history", [
                CatalogItemCopyController::class,
                "borrowHistory",
            ])->name("copies.borrow-history");

            // Book Requests (Circulations)
            Route::post("book-requests/{id}/approve", [
                BookRequestController::class,
                "approve",
            ])->name("book-requests.approve");
            Route::post("book-requests/{id}/disapprove", [
                BookRequestController::class,
                "disapprove",
            ])->name("book-requests.disapprove");
            Route::post("book-requests/store-approved", [
                BookRequestController::class,
                "storeApproved",
            ])->name("book-requests.store-approved");
            Route::resource(
                "book-requests",
                BookRequestController::class,
            )->only(["index", "show", "edit", "update", "destroy"]);

            // Book Returns (Circulations)
            Route::resource("book-returns", BookReturnController::class);
        });
});

require __DIR__ . "/auth.php";
