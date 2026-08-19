<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\InstructorApplication
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $title
 * @property string|null $bio
 * @property array|null $expertise
 * @property string|null $qualifications
 * @property int $experience_years
 * @property array|null $teaching_languages
 * @property string|null $phone
 * @property string $country
 * @property string|null $motivation
 * @property array|null $documents
 * @property string $status
 * @property string|null $rejection_reason
 * @property string|null $admin_notes
 * @property int|null $reviewed_by
 * @property \Illuminate\Support\Carbon|null $reviewed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $reviewer
 */
class InstructorApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'instructor_applications';

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'expertise',
        'qualifications',
        'experience_years',
        'teaching_languages',
        'phone',
        'country',
        'motivation',
        'documents',
        'status',
        'rejection_reason',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'expertise' => 'array',
            'teaching_languages' => 'array',
            'documents' => 'array',
            'experience_years' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
