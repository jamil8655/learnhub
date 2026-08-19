<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_text_ur',
        'options', // JSON array of strings
        'correct_option_index', // 0-indexed integer
        'explanation',
        'explanation_ur',
        'points',
        'order',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_option_index' => 'integer',
        'points' => 'integer',
        'order' => 'integer',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}
