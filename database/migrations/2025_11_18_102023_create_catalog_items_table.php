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
        Schema::create('catalog_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('publisher_id')->nullable()->constrained('publishers')->onDelete('set null');
            $table->string('isbn')->nullable();
            $table->string('isbn13')->nullable();
            $table->string('call_no')->nullable();
            $table->string('subject')->nullable();
            $table->string('series')->nullable();
            $table->string('edition')->nullable();
            $table->string('year')->nullable();
            $table->string('url')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['Available', 'Borrowed'])->default('Available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_items');
    }
};
