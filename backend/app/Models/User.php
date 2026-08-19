<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * App\Models\User
 *
 * @property int|string $id
 * @property string $name
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $email
 * @property string|null $phone
 * @property string $password
 * @property string $role
 * @property string|null $avatar
 * @property string|null $headline
 * @property string|null $bio
 * @property string $country
 * @property string $language
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $two_factor_secret
 * @property array|null $two_factor_recovery_codes
 * @property bool $two_factor_enabled
 * @property \Illuminate\Support\Carbon|null $two_factor_confirmed_at
 * @property bool $marketing_consent
 * @property string $status
 * @property int $learning_streak
 * @property int $longest_streak
 * @property int $total_points
 * @property \Illuminate\Support\Carbon|null $last_login_at
 * @property \Illuminate\Support\Carbon|null $password_changed_at
 * @property bool $notifications_enabled
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'avatar',
        'headline',
        'bio',
        'country',
        'language',
        'email_verified_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_enabled',
        'two_factor_confirmed_at',
        'marketing_consent',
        'status',
        'learning_streak',
        'longest_streak',
        'total_points',
        'last_login_at',
        'password_changed_at',
        'notifications_enabled',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_enabled' => 'boolean',
            'two_factor_recovery_codes' => 'array',
            'two_factor_confirmed_at' => 'datetime',
            'marketing_consent' => 'boolean',
            'notifications_enabled' => 'boolean',
            'learning_streak' => 'integer',
            'longest_streak' => 'integer',
            'total_points' => 'integer',
            'last_login_at' => 'datetime',
            'password_changed_at' => 'datetime',
        ];
    }

    /**
     * Get all active sessions for this user.
     *
     * @return HasMany<Session>
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Get all course enrollments for this user.
     *
     * @return HasMany<Enrollment>
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get all standalone and course quiz attempts for this user.
     *
     * @return HasMany<QuizAttempt>
     */
    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get all earned certificates for this user.
     *
     * @return HasMany<Certificate>
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Get all support tickets filed by this user.
     *
     * @return HasMany<SupportTicket>
     */
    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    /**
     * Get all orders placed by this user.
     *
     * @return HasMany<Order>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get all security events logged for this user.
     *
     * @return HasMany<SecurityEvent>
     */
    public function securityEvents(): HasMany
    {
        return $this->hasMany(SecurityEvent::class);
    }

    /**
     * Get all reviews posted by this user.
     *
     * @return HasMany<Review>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get courses taught by this user (if instructor).
     *
     * @return HasMany<Course>
     */
    public function instructedCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    /**
     * Get instructor profile.
     */
    public function instructorProfile()
    {
        return $this->hasOne(InstructorProfile::class, 'user_id');
    }

    /**
     * Get instructor applications submitted by user.
     */
    public function instructorApplications(): HasMany
    {
        return $this->hasMany(InstructorApplication::class, 'user_id');
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include administrators (admin & super_admin).
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeAdmins(Builder $query): Builder
    {
        return $query->whereIn('role', ['admin', 'super_admin']);
    }

    /**
     * Scope a query to only include instructors.
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeInstructors(Builder $query): Builder
    {
        return $query->where('role', 'instructor');
    }

    /**
     * Scope a query to only include students.
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeStudents(Builder $query): Builder
    {
        return $query->where('role', 'student');
    }

    /**
     * Determine if the user is an administrator.
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin'], true);
    }

    /**
     * Determine if the user is an instructor.
     */
    public function isInstructor(): bool
    {
        return $this->role === 'instructor';
    }

    /**
     * Determine if the user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }
}
