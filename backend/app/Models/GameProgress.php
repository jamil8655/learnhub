<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameProgress extends Model
{
    use HasFactory;

    protected $table = 'game_progress';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'level',
        'total_xp',
        'coins',
        'hearts',
        'streak',
        'unlocked_worlds',
        'completed_stages',
        'inventory',
        'weak_areas',
        'achievements',
    ];

    protected $casts = [
        'level' => 'integer',
        'total_xp' => 'integer',
        'coins' => 'integer',
        'hearts' => 'integer',
        'streak' => 'integer',
        'unlocked_worlds' => 'array',
        'completed_stages' => 'array',
        'inventory' => 'array',
        'weak_areas' => 'array',
        'achievements' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
