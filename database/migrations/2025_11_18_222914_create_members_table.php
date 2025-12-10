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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('member_no')->unique();
            $table->string('name');
            $table->enum('type', ['Regular', 'Privileged'])->default('Regular');
            $table->enum('borrower_category', ['Student', 'Faculty'])->default('Student');
            $table->enum('status', ['Active', 'Inactive', 'Suspended'])->default('Active');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->integer('booking_quota')->nullable();
            $table->string('member_group')->nullable();
            $table->boolean('allow_login')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
