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
        Schema::create('catalog_item_copies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->onDelete('cascade');
            $table->string('accession_no', 7)->unique();
            $table->integer('copy_no');
            $table->string('branch')->nullable();
            $table->string('location')->nullable();
            $table->enum('status', ['Available', 'Borrowed', 'Reserved', 'Lost', 'Under Repair', 'Paid', 'Pending'])->default('Available');
            $table->foreignId('reserved_by_member_id')->nullable()->constrained('members')->onDelete('set null');
            $table->timestamp('reserved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_item_copies');
    }
};
