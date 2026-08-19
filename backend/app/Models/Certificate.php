<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Certificate
 *
 * @property int|string $id
 * @property string $certificate_number
 * @property string $serial_number
 * @property int|string $user_id
 * @property int|string|null $course_id
 * @property int|string|null $quiz_id
 * @property int|string|null $quiz_attempt_id
 * @property string $user_name
 * @property string|null $title
 * @property string|null $instructor_name
 * @property \Illuminate\Support\Carbon $issue_date
 * @property string|null $verification_url
 * @property string|null $grade
 * @property string|null $badge_color
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Course|null $course
 * @property-read \App\Models\Quiz|null $quiz
 * @property-read \App\Models\QuizAttempt|null $quizAttempt
 */
class Certificate extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'certificates';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'certificate_number',
        'serial_number',
        'user_id',
        'course_id',
        'quiz_id',
        'quiz_attempt_id',
        'user_name',
        'title',
        'instructor_name',
        'issue_date',
        'verification_url',
        'grade',
        'badge_color',
        'metadata',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'metadata' => 'array',
        ];
    }

    /**
     * Get the user that earned this certificate.
     *
     * @return BelongsTo<User, Certificate>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course associated with this certificate (if course completion).
     *
     * @return BelongsTo<Course, Certificate>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the standalone quiz associated with this certificate (if quiz pass).
     *
     * @return BelongsTo<Quiz, Certificate>
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the specific quiz attempt linked to this certificate.
     *
     * @return BelongsTo<QuizAttempt, Certificate>
     */
    public function quizAttempt(): BelongsTo
    {
        return $this->belongsTo(QuizAttempt::class);
    }

    /**
     * Scope a query to find certificate by its public serial number.
     *
     * @param  Builder<Certificate>  $query
     * @param  string  $serialNumber
     * @return Builder<Certificate>
     */
    public function scopeBySerialNumber(Builder $query, string $serialNumber): Builder
    {
        return $query->where('serial_number', $serialNumber)
            ->orWhere('certificate_number', $serialNumber);
    }

    /**
     * Scope a query to only include course certificates.
     *
     * @param  Builder<Certificate>  $query
     * @return Builder<Certificate>
     */
    public function scopeForCourse(Builder $query): Builder
    {
        return $query->whereNotNull('course_id');
    }

    /**
     * Scope a query to only include standalone quiz certificates.
     *
     * @param  Builder<Certificate>  $query
     * @return Builder<Certificate>
     */
    public function scopeForQuiz(Builder $query): Builder
    {
        return $query->whereNotNull('quiz_id');
    }

    /**
     * Scope a query to filter certificates by user.
     *
     * @param  Builder<Certificate>  $query
     * @param  int|string  $userId
     * @return Builder<Certificate>
     */
    public function scopeByUser(Builder $query, int|string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
