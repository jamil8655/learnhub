<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Standalone Quizzes Architecture: Quizzes operate completely independently from courses.
     */
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('category')->nullable();
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced', 'All Levels'])->default('Intermediate')->index();
            $table->unsignedInteger('duration_minutes')->default(15);
            $table->unsignedInteger('time_limit_minutes')->default(15);
            $table->unsignedInteger('passing_score')->default(70);
            $table->unsignedInteger('passing_percentage')->default(70);
            $table->unsignedInteger('total_marks')->default(100);
            $table->unsignedInteger('max_attempts')->default(5);
            $table->boolean('randomize_questions')->default(true);
            $table->boolean('randomize_options')->default(true);
            $table->longText('instructions')->nullable();
            $table->unsignedInteger('participants_count')->default(0);
            $table->unsignedDecimal('pass_rate', 5, 2)->default(0.00);
            $table->unsignedDecimal('average_score', 5, 2)->default(0.00);
            $table->enum('status', ['draft', 'published', 'archived'])->default('published')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'is_active']);
            $table->index(['status', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
