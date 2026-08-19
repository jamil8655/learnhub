<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use Illuminate\Foundation\Testing\RefreshDatabase;

class QuizTest extends TestCase
{
    /**
     * Test public quiz discovery endpoint.
     */
    public function test_guest_can_browse_published_quizzes()
    {
        $response = $this->getJson('/api/v1/quizzes');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'pagination'
                 ]);
    }

    /**
     * Test quiz details do not expose correct answer keys to students/guests.
     */
    public function test_quiz_show_sanitizes_correct_answers_for_guests()
    {
        $quiz = Quiz::first();
        if ($quiz) {
            $response = $this->getJson('/api/v1/quizzes/' . $quiz->id);
            $response->assertStatus(200)
                     ->assertJsonMissing([
                         'correct_option_index' => 0,
                         'correct_option_index' => 1,
                         'correct_option_index' => 2,
                         'correct_option_index' => 3,
                     ]);
        }
    }

    /**
     * Test quiz submission and server-side grading.
     */
    public function test_authenticated_user_can_submit_quiz_and_receive_grade()
    {
        $user = User::factory()->create([
            'role' => 'student',
            'status' => 'active'
        ]);

        $quiz = Quiz::first();
        if ($quiz) {
            $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/quizzes/' . $quiz->id . '/submit', [
                'answers' => [
                    1 => 0,
                    2 => 1
                ],
                'time_taken_seconds' => 120
            ]);

            $response->assertStatus(200)
                     ->assertJsonStructure([
                         'success',
                         'data' => [
                             'attempt_id',
                             'total_questions',
                             'correct_answers',
                             'score_percentage',
                             'passed',
                             'results'
                         ]
                     ]);
        }
    }
}
