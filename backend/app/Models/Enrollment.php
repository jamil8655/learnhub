<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Enrollment
 *
 * @property int|string $id
 * @property int|string $user_id
 * @property int|string $course_id
 * @property \Illuminate\Support\Carbon|null $enrolled_at
 * @property float $progress_percentage
 * @property array<string>|null $completed_lessons
 * @property int|string|null $last_viewed_lesson_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Course $course
 * @property-read \App\Models\Lesson|null $lastViewedLesson
 */
class Enrollment extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'enrollments';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'course_id',
        'enrolled_at',
        'progress_percentage',
        'completed_lessons',
        'last_viewed_lesson_id',
        'status',
        'completed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'enrolled_at' => 'datetime',
            'progress_percentage' => 'float',
            'completed_lessons' => 'array',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the user who enrolled in the course.
     *
     * @return BelongsTo<User, Enrollment>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the enrolled course.
     *
     * @return BelongsTo<Course, Enrollment>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the last viewed lesson.
     *
     * @return BelongsTo<Lesson, Enrollment>
     */
    public function lastViewedLesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'last_viewed_lesson_id');
    }

    /**
     * Scope a query to only include active or in-progress enrollments.
     *
     * @param  Builder<Enrollment>  $query
     * @return Builder<Enrollment>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['active', 'in_progress']);
    }

    /**
     * Scope a query to only include completed enrollments.
     *
     * @param  Builder<Enrollment>  $query
     * @return Builder<Enrollment>
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to filter enrollments by user.
     *
     * @param  Builder<Enrollment>  $query
     * @param  int|string  $userId
     * @return Builder<Enrollment>
     */
    public function scopeByUser(Builder $query, int|string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to filter enrollments by course.
     *
     * @param  Builder<Enrollment>  $query
     * @param  int|string  $courseId
     * @return Builder<Enrollment>
     */
    public function scopeByCourse(Builder $query, int|string $courseId): Builder
    {
        return $query->where('course_id', $courseId);
    }
}
