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
        Schema::create('catalog_item_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable(); // For anonymous users
            $table->string('ip_address')->nullable(); // Fallback for tracking
            $table->timestamps();

            // Ensure one like per session/IP per book
            $table->unique(['catalog_item_id', 'session_id']);
        });

        // Add likes_count column to catalog_items for faster queries
        Schema::table('catalog_items', function (Blueprint $table) {
            $table->unsignedInteger('likes_count')->default(0)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_item_likes');

        Schema::table('catalog_items', function (Blueprint $table) {
            $table->dropColumn('likes_count');
        });
    }
};
