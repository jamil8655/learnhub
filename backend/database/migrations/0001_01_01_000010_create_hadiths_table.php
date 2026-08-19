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
        Schema::create('hadiths', function (Blueprint $table) {
            $table->id();
            $table->string('hadith_number', 50)->index();
            $table->string('book_slug', 100)->index();
            $table->string('book_name');
            $table->string('chapter_name')->nullable();
            $table->text('narrator')->nullable();
            $table->longText('arabic_text');
            $table->longText('urdu_translation');
            $table->longText('english_translation')->nullable();
            $table->string('grade', 100)->nullable()->index();
            $table->string('reference', 255)->nullable();
            $table->unsignedInteger('view_count')->default(0);
            $table->timestamps();

            $table->index(['book_slug', 'hadith_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hadiths');
    }
};
