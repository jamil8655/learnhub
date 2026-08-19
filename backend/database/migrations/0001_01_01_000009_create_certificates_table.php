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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->string('serial_number')->nullable()->index();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('quiz_id')->nullable()->constrained('quizzes')->nullOnDelete();
            $table->string('user_name');
            $table->string('title');
            $table->string('course_title')->nullable();
            $table->string('instructor_name')->nullable();
            $table->string('grade')->nullable();
            $table->string('badge_color', 20)->default('#059669');
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->text('qr_code_url')->nullable();
            $table->text('verification_url')->nullable();
            $table->text('pdf_url')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'course_id']);
            $table->index(['user_id', 'quiz_id']);
            $table->index('issue_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
