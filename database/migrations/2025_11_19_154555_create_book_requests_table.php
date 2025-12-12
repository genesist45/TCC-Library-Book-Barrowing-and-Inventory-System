<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->onDelete('cascade');
            $table->foreignId('catalog_item_copy_id')->nullable()->constrained('catalog_item_copies')->onDelete('set null');
            $table->string('full_name');
            $table->string('email');
            $table->integer('quota')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->date('return_date');
            $table->time('return_time')->default('12:00:00');
            $table->text('notes')->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Disapproved', 'Returned'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_requests');
    }
};
