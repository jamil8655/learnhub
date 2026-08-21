<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameStage extends Model
{
    use HasFactory;

    protected $table = 'game_stages';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'world_id',
        'stage_number',
        'title',
        'type',
        'difficulty',
        'time_limit_seconds',
        'reward_xp',
        'reward_coins',
        'icon',
    ];

    protected $casts = [
        'stage_number' => 'integer',
        'time_limit_seconds' => 'integer',
        'reward_xp' => 'integer',
        'reward_coins' => 'integer',
    ];

    public function world(): BelongsTo
    {
        return $this->belongsTo(GameWorld::class, 'world_id', 'id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(GameQuestion::class, 'stage_id', 'id');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(GameAttempt::class, 'stage_id', 'id');
    }
}
