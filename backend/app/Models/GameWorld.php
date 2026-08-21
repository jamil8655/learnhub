<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameWorld extends Model
{
    use HasFactory;

    protected $table = 'game_worlds';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'world_number',
        'title',
        'subtitle',
        'description',
        'theme_color',
        'gradient',
        'icon',
        'unlock_xp',
        'reward_badge',
        'is_active',
    ];

    protected $casts = [
        'world_number' => 'integer',
        'unlock_xp' => 'integer',
        'is_active' => 'boolean',
    ];

    public function stages(): HasMany
    {
        return $this->hasMany(GameStage::class, 'world_id', 'id')->orderBy('stage_number');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('world_number');
    }
}
