<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Review
 *
 * @property int|string $id
 * @property int|string $course_id
 * @property int|string $user_id
 * @property string|null $user_name
 * @property string|null $user_avatar
 * @property int $rating
 * @property string|null $title
 * @property string $comment
 * @property int $helpful_count
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Course $course
 * @property-read \App\Models\User $user
 */
class Review extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'reviews';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'course_id',
        'user_id',
        'user_name',
        'user_avatar',
        'rating',
        'title',
        'comment',
        'helpful_count',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'helpful_count' => 'integer',
        ];
    }

    /**
     * Get the course that was reviewed.
     *
     * @return BelongsTo<Course, Review>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the user who submitted the review.
     *
     * @return BelongsTo<User, Review>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include approved reviews.
     *
     * @param  Builder<Review>  $query
     * @return Builder<Review>
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to filter reviews by rating.
     *
     * @param  Builder<Review>  $query
     * @param  int  $rating
     * @return Builder<Review>
     */
    public function scopeByRating(Builder $query, int $rating): Builder
    {
        return $query->where('rating', $rating);
    }
}
