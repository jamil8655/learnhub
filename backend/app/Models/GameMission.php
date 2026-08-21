<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameMission extends Model
{
    use HasFactory;

    protected $table = 'game_missions';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'description',
        'goal',
        'type',
        'reward_xp',
        'reward_coins',
        'is_daily',
    ];

    protected $casts = [
        'goal' => 'integer',
        'reward_xp' => 'integer',
        'reward_coins' => 'integer',
        'is_daily' => 'boolean',
    ];

    public function scopeDaily($query)
    {
        return $query->where('is_daily', true);
    }
}
