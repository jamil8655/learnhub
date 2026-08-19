<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\InstructorProfile
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $title
 * @property string|null $bio
 * @property array|null $expertise
 * @property string|null $qualifications
 * @property int $experience_years
 * @property float $rating
 * @property int $reviews_count
 * @property int $students_count
 * @property int $courses_count
 * @property array|null $social_links
 * @property array|null $payout_details
 * @property bool $is_featured
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 */
class InstructorProfile extends Model
{
    use HasFactory;

    protected $table = 'instructor_profiles';

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'expertise',
        'qualifications',
        'experience_years',
        'rating',
        'reviews_count',
        'students_count',
        'courses_count',
        'social_links',
        'payout_details',
        'is_featured',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'expertise' => 'array',
            'social_links' => 'array',
            'payout_details' => 'array',
            'experience_years' => 'integer',
            'rating' => 'float',
            'reviews_count' => 'integer',
            'students_count' => 'integer',
            'courses_count' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'instructor_id', 'user_id');
    }
}
