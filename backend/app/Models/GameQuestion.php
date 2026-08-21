<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameQuestion extends Model
{
    use HasFactory;

    protected $table = 'game_questions';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'stage_id',
        'world_id',
        'type',
        'title',
        'question_text',
        'options_payload',
        'correct_answer_payload',
        'hint',
        'explanation',
        'reference',
    ];

    protected $casts = [
        'options_payload' => 'array',
        'correct_answer_payload' => 'array',
    ];

    public function stage(): BelongsTo
    {
        return $this->belongsTo(GameStage::class, 'stage_id', 'id');
    }
}
