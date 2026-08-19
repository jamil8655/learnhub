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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('instructor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('badge')->nullable();
            $table->enum('level', ['all_levels', 'beginner', 'intermediate', 'advanced'])->default('all_levels')->index();
            $table->string('language', 50)->default('Urdu');
            $table->decimal('duration_hours', 8, 2)->default(0.00);
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('original_price', 10, 2)->nullable()->default(0.00);
            $table->boolean('is_free')->default(true)->index();
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->unsignedInteger('review_count')->default(0);
            $table->unsignedInteger('student_count')->default(0);
            $table->text('thumbnail')->nullable();
            $table->text('promo_video')->nullable();
            $table->json('learning_outcomes')->nullable();
            $table->json('requirements')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('published')->index();
            $table->boolean('featured')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'featured']);
            $table->index(['category_id', 'status']);
            $table->index(['instructor_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
