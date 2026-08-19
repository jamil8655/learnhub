<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Lesson
 *
 * @property int|string $id
 * @property int|string $course_id
 * @property int $order
 * @property string $title
 * @property string|null $slug
 * @property int $duration_minutes
 * @property string $type
 * @property string|null $video_url
 * @property string|null $content_body
 * @property bool $is_free_preview
 * @property bool $is_published
 * @property string|null $description
 * @property array<array{title: string, url: string, type: string, size: string}>|null $resources
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Course $course
 */
class Lesson extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'lessons';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'course_id',
        'order',
        'title',
        'slug',
        'duration_minutes',
        'type',
        'video_url',
        'content_body',
        'is_free_preview',
        'is_published',
        'description',
        'resources',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'duration_minutes' => 'integer',
            'is_free_preview' => 'boolean',
            'is_published' => 'boolean',
            'resources' => 'array',
        ];
    }

    /**
     * Get the course that owns the lesson.
     *
     * @return BelongsTo<Course, Lesson>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Scope a query to only include published lessons.
     *
     * @param  Builder<Lesson>  $query
     * @return Builder<Lesson>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to only include free preview lessons.
     *
     * @param  Builder<Lesson>  $query
     * @return Builder<Lesson>
     */
    public function scopeFreePreview(Builder $query): Builder
    {
        return $query->where('is_free_preview', true);
    }

    /**
     * Scope a query to sort lessons in sequence order.
     *
     * @param  Builder<Lesson>  $query
     * @return Builder<Lesson>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order', 'asc');
    }
}
