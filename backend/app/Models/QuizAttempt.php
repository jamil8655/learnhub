<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\QuizAttempt
 *
 * @property int|string $id
 * @property int|string $quiz_id
 * @property int|string $user_id
 * @property float $score
 * @property float $total_marks
 * @property float $percentage
 * @property bool $passed
 * @property int $time_taken_seconds
 * @property int $attempt_number
 * @property array<array{question_id: int|string, selected_option_id: int|string|null, selected_option_index: int|null, is_correct: bool}> $answers_payload
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Quiz $quiz
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Certificate|null $certificate
 */
class QuizAttempt extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'quiz_attempts';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quiz_id',
        'user_id',
        'score',
        'total_marks',
        'percentage',
        'passed',
        'time_taken_seconds',
        'attempt_number',
        'answers_payload',
        'status',
        'started_at',
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
            'score' => 'float',
            'total_marks' => 'float',
            'percentage' => 'float',
            'passed' => 'boolean',
            'time_taken_seconds' => 'integer',
            'attempt_number' => 'integer',
            'answers_payload' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the quiz associated with this attempt.
     *
     * @return BelongsTo<Quiz, QuizAttempt>
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the user who made this attempt.
     *
     * @return BelongsTo<User, QuizAttempt>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the certificate generated from this attempt (if passed).
     *
     * @return HasOne<Certificate>
     */
    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class, 'quiz_attempt_id');
    }

    /**
     * Scope a query to only include passing attempts.
     *
     * @param  Builder<QuizAttempt>  $query
     * @return Builder<QuizAttempt>
     */
    public function scopePassed(Builder $query): Builder
    {
        return $query->where('passed', true);
    }

    /**
     * Scope a query to only include completed attempts.
     *
     * @param  Builder<QuizAttempt>  $query
     * @return Builder<QuizAttempt>
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->whereNotNull('completed_at');
    }

    /**
     * Scope a query to filter attempts by user.
     *
     * @param  Builder<QuizAttempt>  $query
     * @param  int|string  $userId
     * @return Builder<QuizAttempt>
     */
    public function scopeByUser(Builder $query, int|string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to filter attempts by quiz.
     *
     * @param  Builder<QuizAttempt>  $query
     * @param  int|string  $quizId
     * @return Builder<QuizAttempt>
     */
    public function scopeByQuiz(Builder $query, int|string $quizId): Builder
    {
        return $query->where('quiz_id', $quizId);
    }
}
