<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Coupon
 *
 * @property int|string $id
 * @property string $code
 * @property string $discount_type
 * @property float $discount_value
 * @property float $min_purchase
 * @property int|null $max_usage
 * @property int $used_count
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 */
class Coupon extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'coupons';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_purchase',
        'max_usage',
        'used_count',
        'is_active',
        'starts_at',
        'expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'min_purchase' => 'decimal:2',
            'max_usage' => 'integer',
            'used_count' => 'integer',
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get all orders that applied this coupon.
     *
     * @return HasMany<Order>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Scope a query to only include active and non-expired coupons.
     *
     * @param  Builder<Coupon>  $query
     * @return Builder<Coupon>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q) {
                $q->whereNull('starts_at')
                  ->orWhere('starts_at', '<=', now());
            })
            ->where(function (Builder $q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>=', now());
            })
            ->where(function (Builder $q) {
                $q->whereNull('max_usage')
                  ->orWhereColumn('used_count', '<', 'max_usage');
            });
    }

    /**
     * Scope a query to filter coupons valid for a given order amount.
     *
     * @param  Builder<Coupon>  $query
     * @param  float  $amount
     * @return Builder<Coupon>
     */
    public function scopeValidForAmount(Builder $query, float $amount): Builder
    {
        return $query->active()->where('min_purchase', '<=', $amount);
    }

    /**
     * Determine if coupon is currently valid.
     */
    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_usage !== null && $this->used_count >= $this->max_usage) {
            return false;
        }

        return true;
    }

    /**
     * Calculate the discounted amount for a given subtotal.
     */
    public function calculateDiscount(float $subtotal): float
    {
        if ($subtotal < (float) $this->min_purchase) {
            return 0.0;
        }

        if ($this->discount_type === 'percentage') {
            return round(($subtotal * (float) $this->discount_value) / 100, 2);
        }

        // Fixed discount amount capped at subtotal
        return min((float) $this->discount_value, $subtotal);
    }
}
