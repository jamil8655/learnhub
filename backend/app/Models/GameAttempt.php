<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameAttempt extends Model
{
    use HasFactory;

    protected $table = 'game_attempts';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'stage_id',
        'world_id',
        'score',
        'stars',
        'accuracy',
        'time_taken_seconds',
        'answers_payload',
        'completed_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'stars' => 'integer',
        'accuracy' => 'integer',
        'time_taken_seconds' => 'integer',
        'answers_payload' => 'array',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(GameStage::class, 'stage_id', 'id');
    }
}
