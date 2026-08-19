<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Quiz
 *
 * @property int|string $id
 * @property int|string|null $category_id
 * @property int|string|null $course_id
 * @property string $title
 * @property string $slug
 * @property string $difficulty
 * @property int $time_limit_minutes
 * @property int $passing_percentage
 * @property int $max_attempts
 * @property bool $randomize_questions
 * @property bool $randomize_options
 * @property string $status
 * @property bool $is_active
 * @property string|null $short_description
 * @property string|null $instructions
 * @property int $participants_count
 * @property float $pass_rate
 * @property float $average_score
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Category|null $category
 * @property-read \App\Models\Course|null $course
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\QuizAttempt> $quizAttempts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Certificate> $certificates
 */
class Quiz extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'quizzes';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'course_id',
        'title',
        'slug',
        'difficulty',
        'time_limit_minutes',
        'passing_percentage',
        'max_attempts',
        'randomize_questions',
        'randomize_options',
        'status',
        'is_active',
        'short_description',
        'instructions',
        'participants_count',
        'pass_rate',
        'average_score',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'time_limit_minutes' => 'integer',
            'passing_percentage' => 'integer',
            'max_attempts' => 'integer',
            'randomize_questions' => 'boolean',
            'randomize_options' => 'boolean',
            'is_active' => 'boolean',
            'participants_count' => 'integer',
            'pass_rate' => 'float',
            'average_score' => 'float',
        ];
    }

    /**
     * Get the category that this quiz belongs to.
     *
     * @return BelongsTo<Category, Quiz>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the optional course associated with this quiz (if not standalone).
     *
     * @return BelongsTo<Course, Quiz>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get all questions for this quiz.
     *
     * @return HasMany<Question>
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order', 'asc');
    }

    /**
     * Get all quiz attempts submitted by users.
     *
     * @return HasMany<QuizAttempt>
     */
    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get all certificates issued for this quiz.
     *
     * @return HasMany<Certificate>
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Scope a query to only include active and published quizzes.
     *
     * @param  Builder<Quiz>  $query
     * @return Builder<Quiz>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q) {
                $q->where('status', 'published')
                  ->orWhereNull('status');
            });
    }

    /**
     * Scope a query to only include standalone quizzes (independent of courses).
     *
     * @param  Builder<Quiz>  $query
     * @return Builder<Quiz>
     */
    public function scopeStandalone(Builder $query): Builder
    {
        return $query->whereNull('course_id');
    }

    /**
     * Scope a query to filter quizzes by difficulty level.
     *
     * @param  Builder<Quiz>  $query
     * @param  string  $difficulty
     * @return Builder<Quiz>
     */
    public function scopeByDifficulty(Builder $query, string $difficulty): Builder
    {
        return $query->where('difficulty', $difficulty);
    }

    /**
     * Scope a query to filter quizzes by category.
     *
     * @param  Builder<Quiz>  $query
     * @param  int|string  $categoryId
     * @return Builder<Quiz>
     */
    public function scopeByCategory(Builder $query, int|string $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }
}
