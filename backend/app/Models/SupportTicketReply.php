<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\SupportTicketReply
 *
 * @property int|string $id
 * @property int|string $ticket_id
 * @property int|string|null $user_id
 * @property string $sender_name
 * @property string $sender_role
 * @property string $message
 * @property bool $is_staff_reply
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\SupportTicket $ticket
 * @property-read \App\Models\User|null $user
 */
class SupportTicketReply extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'support_ticket_replies';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'sender_name',
        'sender_role',
        'message',
        'is_staff_reply',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_staff_reply' => 'boolean',
        ];
    }

    /**
     * Get the support ticket this reply belongs to.
     *
     * @return BelongsTo<SupportTicket, SupportTicketReply>
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }

    /**
     * Get the user who sent this reply (if authenticated).
     *
     * @return BelongsTo<User, SupportTicketReply>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
