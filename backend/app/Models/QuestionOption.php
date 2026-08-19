<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\QuestionOption
 *
 * @property int|string $id
 * @property int|string $question_id
 * @property string $option_text
 * @property bool $is_correct
 * @property int $order
 * @property string|null $explanation
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Question $question
 */
class QuestionOption extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'question_options';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
        'order',
        'explanation',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Kept hidden by default for student endpoints to prevent answer leaking.
     *
     * @var list<string>
     */
    protected $hidden = [
        'is_correct',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Get the question that owns this option.
     *
     * @return BelongsTo<Question, QuestionOption>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Scope a query to only include correct options (for backend validation/grading).
     *
     * @param  Builder<QuestionOption>  $query
     * @return Builder<QuestionOption>
     */
    public function scopeCorrect(Builder $query): Builder
    {
        return $query->where('is_correct', true);
    }

    /**
     * Scope a query to sort options in display order.
     *
     * @param  Builder<QuestionOption>  $query
     * @return Builder<QuestionOption>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order', 'asc');
    }
}
