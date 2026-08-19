<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Order
 *
 * @property int|string $id
 * @property string $order_number
 * @property int|string $user_id
 * @property string|null $user_name
 * @property int|string|null $coupon_id
 * @property string|null $coupon_code
 * @property float $subtotal
 * @property float $discount
 * @property float $total
 * @property string $currency
 * @property string|null $payment_method
 * @property string $payment_status
 * @property string $status
 * @property array<string, mixed>|null $billing_details
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Coupon|null $coupon
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $items
 */
class Order extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'user_id',
        'user_name',
        'coupon_id',
        'coupon_code',
        'subtotal',
        'discount',
        'total',
        'currency',
        'payment_method',
        'payment_status',
        'status',
        'billing_details',
        'paid_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'billing_details' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Get the user who placed this order.
     *
     * @return BelongsTo<User, Order>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the coupon used on this order (if any).
     *
     * @return BelongsTo<Coupon, Order>
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get all purchased items in this order.
     *
     * @return HasMany<OrderItem>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope a query to only include completed orders.
     *
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include pending orders.
     *
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to filter orders by user.
     *
     * @param  Builder<Order>  $query
     * @param  int|string  $userId
     * @return Builder<Order>
     */
    public function scopeByUser(Builder $query, int|string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
