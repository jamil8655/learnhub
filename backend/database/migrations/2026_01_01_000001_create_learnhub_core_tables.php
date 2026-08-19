<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ur')->nullable();
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 2. Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_ur')->nullable();
            $table->string('slug')->unique();
            $table->text('short_description');
            $table->text('short_description_ur')->nullable();
            $table->longText('description');
            $table->longText('description_ur')->nullable();
            $table->string('thumbnail')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->boolean('is_free')->default(true);
            $table->string('level')->default('all'); // beginner, intermediate, advanced, all
            $table->string('language')->default('Urdu');
            $table->string('status')->default('published'); // draft, published, archived
            $table->foreignId('instructor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->integer('enrolled_count')->default(0);
            $table->integer('duration_minutes')->default(0);
            $table->timestamps();
        });

        // 3. Lessons
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('title');
            $table->string('title_ur')->nullable();
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->string('video_url')->nullable();
            $table->longText('content')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->integer('order')->default(1);
            $table->boolean('is_preview')->default(false);
            $table->string('status')->default('published');
            $table->timestamps();
        });

        // 4. Course Enrollments
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('status')->default('active'); // active, completed, dropped
            $table->float('progress_percentage')->default(0);
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->string('payment_status')->default('free'); // free, paid, pending
            $table->decimal('amount_paid', 10, 2)->default(0.00);
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        // 5. Lesson Progress
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->integer('last_watched_seconds')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
        });

        // 6. Quizzes
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_ur')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('description_ur')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->string('difficulty')->default('beginner'); // beginner, intermediate, advanced
            $table->integer('time_limit_minutes')->default(15);
            $table->float('pass_percentage')->default(70.0);
            $table->integer('max_attempts')->default(0); // 0 = unlimited
            $table->boolean('is_standalone')->default(true);
            $table->string('status')->default('published');
            $table->timestamps();
        });

        // 7. Quiz Questions
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->text('question_text');
            $table->text('question_text_ur')->nullable();
            $table->json('options'); // array of options
            $table->integer('correct_option_index'); // 0-indexed
            $table->text('explanation')->nullable();
            $table->text('explanation_ur')->nullable();
            $table->integer('points')->default(1);
            $table->integer('order')->default(1);
            $table->timestamps();
        });

        // 8. Quiz Attempts
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->integer('total_questions');
            $table->integer('correct_answers');
            $table->float('score_percentage');
            $table->boolean('passed')->default(false);
            $table->integer('time_taken_seconds')->default(0);
            $table->json('user_answers')->nullable();
            $table->json('detailed_results')->nullable();
            $table->integer('attempt_number')->default(1);
            $table->timestamps();
        });

        // 9. Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_code')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('quiz_id')->nullable()->constrained('quizzes')->nullOnDelete();
            $table->string('type')->default('course_completion'); // course_completion, quiz_excellence
            $table->string('recipient_name');
            $table->string('title');
            $table->string('title_ur')->nullable();
            $table->string('grade')->default('Pass');
            $table->float('score_percentage')->default(100.0);
            $table->timestamp('issued_at')->useCurrent();
            $table->string('qr_code_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // 10. Hadiths
        Schema::create('hadiths', function (Blueprint $table) {
            $table->id();
            $table->string('book_slug')->index();
            $table->string('book_name_en');
            $table->string('book_name_ur');
            $table->string('book_name_ar');
            $table->integer('chapter_number')->default(1)->index();
            $table->string('chapter_title_en')->nullable();
            $table->string('chapter_title_ur')->nullable();
            $table->string('chapter_title_ar')->nullable();
            $table->integer('hadith_number')->index();
            $table->string('narrator_en')->nullable();
            $table->string('narrator_ur')->nullable();
            $table->longText('text_ar');
            $table->longText('text_ur');
            $table->longText('text_en')->nullable();
            $table->string('grade')->default('Sahih');
            $table->string('reference')->nullable();
            $table->timestamps();
        });

        // 11. User Sessions
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('token_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_name')->nullable();
            $table->timestamp('last_active_at')->useCurrent();
            $table->boolean('is_revoked')->default(false);
            $table->timestamps();
        });

        // 12. Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_name')->nullable();
            $table->string('action')->index();
            $table->text('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('user_sessions');
        Schema::dropIfExists('hadiths');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('categories');
    }
};
