<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SupportTicket
 *
 * @property int|string $id
 * @property string $ticket_number
 * @property int|string $user_id
 * @property string|null $user_name
 * @property string|null $user_email
 * @property int|string|null $assigned_to_id
 * @property string $category
 * @property string $subject
 * @property string $message
 * @property string $priority
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $resolved_at
 * @property \Illuminate\Support\Carbon|null $closed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $assignedTo
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SupportTicketReply> $replies
 */
class SupportTicket extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'support_tickets';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_number',
        'user_id',
        'user_name',
        'user_email',
        'assigned_to_id',
        'category',
        'subject',
        'message',
        'priority',
        'status',
        'resolved_at',
        'closed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    /**
     * Get the user who opened this support ticket.
     *
     * @return BelongsTo<User, SupportTicket>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin or staff member assigned to this ticket.
     *
     * @return BelongsTo<User, SupportTicket>
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    /**
     * Get all conversation replies for this support ticket.
     *
     * @return HasMany<SupportTicketReply>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(SupportTicketReply::class, 'ticket_id')->orderBy('created_at', 'asc');
    }

    /**
     * Scope a query to only include open/pending tickets.
     *
     * @param  Builder<SupportTicket>  $query
     * @return Builder<SupportTicket>
     */
    public function scopeOpen(Builder $query): Builder
    {
        return $query->whereIn('status', ['open', 'pending', 'in_progress']);
    }

    /**
     * Scope a query to only include resolved tickets.
     *
     * @param  Builder<SupportTicket>  $query
     * @return Builder<SupportTicket>
     */
    public function scopeResolved(Builder $query): Builder
    {
        return $query->where('status', 'resolved');
    }

    /**
     * Scope a query to filter tickets by priority.
     *
     * @param  Builder<SupportTicket>  $query
     * @param  string  $priority
     * @return Builder<SupportTicket>
     */
    public function scopeByPriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope a query to filter tickets by user.
     *
     * @param  Builder<SupportTicket>  $query
     * @param  int|string  $userId
     * @return Builder<SupportTicket>
     */
    public function scopeByUser(Builder $query, int|string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
