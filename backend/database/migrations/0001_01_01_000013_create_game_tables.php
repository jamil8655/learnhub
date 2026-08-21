<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for LearnHub Adventure Game tables.
     */
    public function up(): void
    {
        // 1. Game Worlds (9 Realms)
        Schema::create('game_worlds', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('world_number')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('theme_color')->default('#059669');
            $table->string('gradient')->default('from-emerald-600 to-teal-800');
            $table->string('icon')->default('sparkles');
            $table->integer('unlock_xp')->default(0);
            $table->string('reward_badge')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Game Stages
        Schema::create('game_stages', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('world_id');
            $table->foreign('world_id')->references('id')->on('game_worlds')->onDelete('cascade');
            $table->integer('stage_number');
            $table->string('title');
            $table->string('type')->default('knowledge'); // sequential_order, memory_match, term_connector, rapid_binary, verse_gem_bank, knowledge, boss
            $table->string('difficulty')->default('medium'); // easy, medium, hard
            $table->integer('time_limit_seconds')->default(60);
            $table->integer('reward_xp')->default(150);
            $table->integer('reward_coins')->default(50);
            $table->string('icon')->default('play');
            $table->timestamps();

            $table->unique(['world_id', 'stage_number']);
        });

        // 3. Game Questions & Puzzles
        Schema::create('game_questions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('stage_id');
            $table->foreign('stage_id')->references('id')->on('game_stages')->onDelete('cascade');
            $table->string('world_id');
            $table->string('type')->default('knowledge');
            $table->string('title');
            $table->text('question_text')->nullable();
            $table->json('options_payload')->nullable(); // multiple choice options, memory cards, or items
            $table->json('correct_answer_payload')->nullable(); // index, sequence, pairs or word list
            $table->text('hint')->nullable();
            $table->text('explanation')->nullable();
            $table->string('reference')->nullable();
            $table->timestamps();
        });

        // 4. Game Attempts (History & Fair-Play Audit)
        Schema::create('game_attempts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable();
            $table->string('stage_id');
            $table->string('world_id');
            $table->integer('score')->default(0);
            $table->integer('stars')->default(0);
            $table->integer('accuracy')->default(0);
            $table->integer('time_taken_seconds')->default(0);
            $table->json('answers_payload')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'stage_id']);
        });

        // 5. Game Player Progress
        Schema::create('game_progress', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->unique();
            $table->integer('level')->default(1);
            $table->integer('total_xp')->default(0);
            $table->integer('coins')->default(250);
            $table->integer('hearts')->default(3);
            $table->integer('streak')->default(1);
            $table->json('unlocked_worlds')->nullable();
            $table->json('completed_stages')->nullable();
            $table->json('inventory')->nullable();
            $table->json('weak_areas')->nullable();
            $table->json('achievements')->nullable();
            $table->timestamps();
        });

        // 6. Game Missions
        Schema::create('game_missions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('goal')->default(1);
            $table->string('type')->default('stages_completed');
            $table->integer('reward_xp')->default(100);
            $table->integer('reward_coins')->default(40);
            $table->boolean('is_daily')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_missions');
        Schema::dropIfExists('game_progress');
        Schema::dropIfExists('game_attempts');
        Schema::dropIfExists('game_questions');
        Schema::dropIfExists('game_stages');
        Schema::dropIfExists('game_worlds');
    }
};
