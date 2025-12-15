<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_request_id')->constrained('book_requests')->onDelete('cascade');
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->onDelete('cascade');
            $table->date('return_date');
            $table->time('return_time');
            $table->enum('condition_on_return', ['Good', 'Damaged', 'Lost'])->default('Good');
            $table->text('remarks')->nullable();
            $table->decimal('penalty_amount', 10, 2)->default(0);
            $table->enum('status', ['Returned', 'Pending', 'Paid'])->default('Pending');
            $table->foreignId('processed_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_returns');
    }
};
