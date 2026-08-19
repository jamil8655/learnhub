<?php

namespace App\Policies;

use App\Models\Quiz;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuizPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Quiz $quiz): bool
    {
        if ($quiz->status === 'published') {
            return true;
        }

        if (!$user) {
            return false;
        }

        return $user->isAdmin();
    }

    /**
     * Determine whether the user can attempt/submit the quiz.
     */
    public function submit(User $user, Quiz $quiz): bool
    {
        if (!$user->isActive() || $quiz->status !== 'published') {
            return false;
        }

        // Check if max_attempts is set and reached
        if ($quiz->max_attempts > 0) {
            $attemptsCount = $user->quizAttempts()->where('quiz_id', $quiz->id)->count();
            if ($attemptsCount >= $quiz->max_attempts) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Quiz $quiz): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Quiz $quiz): bool
    {
        return $user->isAdmin();
    }
}
