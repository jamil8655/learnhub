<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Question
 *
 * @property int|string $id
 * @property int|string $quiz_id
 * @property int $order
 * @property string $type
 * @property int $marks
 * @property string $question_text
 * @property string|null $explanation
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Quiz $quiz
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\QuestionOption> $options
 */
class Question extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'questions';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quiz_id',
        'order',
        'type',
        'marks',
        'question_text',
        'explanation',
        'is_active',
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
            'marks' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the quiz that this question belongs to.
     *
     * @return BelongsTo<Quiz, Question>
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get all answer options for this question.
     *
     * @return HasMany<QuestionOption>
     */
    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class)->orderBy('order', 'asc');
    }

    /**
     * Scope a query to only include active questions.
     *
     * @param  Builder<Question>  $query
     * @return Builder<Question>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to sort questions by sequential order.
     *
     * @param  Builder<Question>  $query
     * @return Builder<Question>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order', 'asc');
    }
}
