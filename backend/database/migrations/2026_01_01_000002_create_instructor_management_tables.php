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
        // 1. Instructor Applications Table
        Schema::create('instructor_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title')->nullable(); // e.g. "محقق علومِ حدیث و استاذ فقہ"
            $table->text('bio')->nullable();
            $table->json('expertise')->nullable(); // e.g. ["تجوید", "حدیث", "فقہ"]
            $table->string('qualifications')->nullable(); // e.g. "عالمیہ، پی ایچ ڈی اسلامیات"
            $table->unsignedInteger('experience_years')->default(1);
            $table->json('teaching_languages')->nullable(); // e.g. ["اردو", "عربی"]
            $table->string('phone')->nullable();
            $table->string('country')->default('PK');
            $table->text('motivation')->nullable();
            $table->json('documents')->nullable(); // certification URLs
            $table->string('status')->default('submitted'); // submitted, under_review, approved, rejected, more_info_required, suspended
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
        });

        // 2. Instructor Profiles Table
        Schema::create('instructor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->text('bio')->nullable();
            $table->json('expertise')->nullable();
            $table->string('qualifications')->nullable();
            $table->unsignedInteger('experience_years')->default(1);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('students_count')->default(0);
            $table->unsignedInteger('courses_count')->default(0);
            $table->json('social_links')->nullable();
            $table->json('payout_details')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructor_profiles');
        Schema::dropIfExists('instructor_applications');
    }
};
