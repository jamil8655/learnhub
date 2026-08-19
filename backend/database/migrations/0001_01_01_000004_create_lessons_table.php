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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('section_title')->default('General');
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content_body')->nullable();
            $table->enum('type', ['video', 'text', 'quiz', 'document'])->default('video');
            $table->unsignedInteger('duration_minutes')->default(10);
            $table->text('video_url')->nullable();
            $table->boolean('is_preview')->default(false)->index();
            $table->boolean('is_free_preview')->default(false);
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->json('resources')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['course_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
