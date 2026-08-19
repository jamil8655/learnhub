<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\SecurityEvent
 *
 * @property int|string $id
 * @property int|string|null $user_id
 * @property string $event_type
 * @property string $severity
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $description
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 */
class SecurityEvent extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'security_events';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'event_type',
        'severity',
        'ip_address',
        'user_agent',
        'description',
        'metadata',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    /**
     * Get the user associated with this security event (if authenticated).
     *
     * @return BelongsTo<User, SecurityEvent>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include critical security events.
     *
     * @param  Builder<SecurityEvent>  $query
     * @return Builder<SecurityEvent>
     */
    public function scopeCritical(Builder $query): Builder
    {
        return $query->where('severity', 'critical');
    }

    /**
     * Scope a query to include warnings and critical events.
     *
     * @param  Builder<SecurityEvent>  $query
     * @return Builder<SecurityEvent>
     */
    public function scopeWarnings(Builder $query): Builder
    {
        return $query->whereIn('severity', ['warning', 'critical']);
    }

    /**
     * Scope a query to filter by event type.
     *
     * @param  Builder<SecurityEvent>  $query
     * @param  string  $eventType
     * @return Builder<SecurityEvent>
     */
    public function scopeByType(Builder $query, string $eventType): Builder
    {
        return $query->where('event_type', $eventType);
    }

    /**
     * Scope a query to filter events by user.
     *
     * @param  Builder<SecurityEvent>  $query
     * @param  int|string  $userId
     * @return Builder<SecurityEvent>
     */
    public function scopeByUser(Builder $query, int|string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
