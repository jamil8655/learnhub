<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Course
 *
 * @property int|string $id
 * @property int|string $category_id
 * @property int|string|null $instructor_id
 * @property string $title
 * @property string $slug
 * @property string|null $thumbnail
 * @property string|null $badge
 * @property string $level
 * @property string $language
 * @property float $price
 * @property float|null $original_price
 * @property bool $is_free
 * @property bool $is_featured
 * @property string $status
 * @property float $rating
 * @property int $rating_count
 * @property float $duration_hours
 * @property int $enrolled_count
 * @property string|null $short_description
 * @property string|null $description
 * @property array<string>|null $learning_outcomes
 * @property array<string>|null $requirements
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Category $category
 * @property-read \App\Models\User|null $instructor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lesson> $lessons
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Enrollment> $enrollments
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Certificate> $certificates
 */
class Course extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'courses';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'instructor_id',
        'title',
        'slug',
        'thumbnail',
        'badge',
        'level',
        'language',
        'price',
        'original_price',
        'is_free',
        'is_featured',
        'status',
        'rating',
        'rating_count',
        'duration_hours',
        'enrolled_count',
        'short_description',
        'description',
        'learning_outcomes',
        'requirements',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'is_free' => 'boolean',
            'is_featured' => 'boolean',
            'rating' => 'float',
            'rating_count' => 'integer',
            'duration_hours' => 'float',
            'enrolled_count' => 'integer',
            'learning_outcomes' => 'array',
            'requirements' => 'array',
        ];
    }

    /**
     * Get the category that this course belongs to.
     *
     * @return BelongsTo<Category, Course>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the instructor assigned to this course.
     *
     * @return BelongsTo<User, Course>
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get all lessons in this course.
     *
     * @return HasMany<Lesson>
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order', 'asc');
    }

    /**
     * Get all enrollments for this course.
     *
     * @return HasMany<Enrollment>
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get all reviews for this course.
     *
     * @return HasMany<Review>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get all certificates issued for this course.
     *
     * @return HasMany<Certificate>
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Scope a query to only include published courses.
     *
     * @param  Builder<Course>  $query
     * @return Builder<Course>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include featured courses.
     *
     * @param  Builder<Course>  $query
     * @return Builder<Course>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include free courses.
     *
     * @param  Builder<Course>  $query
     * @return Builder<Course>
     */
    public function scopeFree(Builder $query): Builder
    {
        return $query->where('is_free', true);
    }

    /**
     * Scope a query to filter courses by level.
     *
     * @param  Builder<Course>  $query
     * @param  string  $level
     * @return Builder<Course>
     */
    public function scopeByLevel(Builder $query, string $level): Builder
    {
        return $query->where('level', $level);
    }

    /**
     * Scope a query to filter courses by category.
     *
     * @param  Builder<Course>  $query
     * @param  int|string  $categoryId
     * @return Builder<Course>
     */
    public function scopeByCategory(Builder $query, int|string $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }
}
