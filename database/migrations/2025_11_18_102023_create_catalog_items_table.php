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
            $table->string('accession_no', 7)->unique();
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
            $table->string('place_of_publication')->nullable();
            $table->string('extent')->nullable();
            $table->string('other_physical_details')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('url')->nullable();
            $table->text('description')->nullable();
            $table->enum('location', ['Filipianna', 'Circulation', 'Theses', 'Fiction', 'Reserve'])->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['Available', 'Borrowed'])->default('Available');
            
            $table->string('volume')->nullable();
            $table->string('page_duration')->nullable();
            $table->text('abstract')->nullable();
            $table->text('biblio_info')->nullable();
            $table->enum('url_visibility', ['Public', 'Staff Only'])->nullable();
            $table->string('library_branch')->nullable();
            
            $table->string('issn')->nullable();
            $table->string('frequency')->nullable();
            $table->string('journal_type')->nullable();
            $table->string('issue_type')->nullable();
            $table->string('issue_period')->nullable();
            
            $table->string('granting_institution')->nullable();
            $table->string('degree_qualification')->nullable();
            $table->string('supervisor')->nullable();
            $table->date('thesis_date')->nullable();
            $table->string('thesis_period')->nullable();
            $table->string('publication_type')->nullable();
            
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
