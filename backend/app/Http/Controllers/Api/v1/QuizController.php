<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuizSubmitRequest;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    /**
     * List all published quizzes with question counts and categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Quiz::query()
            ->with(['category:id,name,name_ur,slug', 'course:id,title,title_ur'])
            ->withCount('questions');

        $user = $request->user('sanctum');
        if (!$user || !$user->isAdmin()) {
            $query->where('status', 'published');
        } elseif ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by category
        if ($category = $request->input('category')) {
            if ($category !== 'all') {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category)->orWhere('id', $category);
                });
            }
        }

        // Filter by difficulty
        if ($difficulty = $request->input('difficulty')) {
            if ($difficulty !== 'all') {
                $query->where('difficulty', strtolower($difficulty));
            }
        }

        // Search in title / description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('title_ur', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->input('per_page', 12), 50);
        $quizzes = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $quizzes->items(),
            'pagination' => [
                'current_page' => $quizzes->currentPage(),
                'per_page' => $quizzes->perPage(),
                'total' => $quizzes->total(),
                'last_page' => $quizzes->lastPage(),
            ]
        ], 200);
    }

    /**
     * Show quiz details & questions WITHOUT revealing correct answer keys or explanations.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user('sanctum');

        $quiz = Quiz::with(['category:id,name,name_ur,slug'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'کوئز نہیں ملا۔ (Quiz not found)',
            ], 404);
        }

        if ($quiz->status !== 'published' && (!$user || !$user->isAdmin())) {
            return response()->json([
                'success' => false,
                'message' => 'یہ کوئز فی الحال فعال نہیں ہے۔ (Quiz not available)',
            ], 403);
        }

        // Admin can see complete questions with answers, student/guest receives sanitized questions
        $isAdmin = $user && $user->isAdmin();

        $questionsQuery = QuizQuestion::where('quiz_id', $quiz->id)->orderBy('order', 'asc');

        if ($isAdmin) {
            $questions = $questionsQuery->get();
        } else {
            // SECURE: Hide correct_option_index and explanation to prevent client-side inspection cheating
            $questions = $questionsQuery->get([
                'id',
                'quiz_id',
                'question_text',
                'question_text_ur',
                'options',
                'points',
                'order'
            ]);
        }

        $attemptsCount = 0;
        $bestAttempt = null;
        if ($user) {
            $attemptsCount = QuizAttempt::where('user_id', $user->id)->where('quiz_id', $quiz->id)->count();
            $bestAttempt = QuizAttempt::where('user_id', $user->id)
                ->where('quiz_id', $quiz->id)
                ->orderBy('score_percentage', 'desc')
                ->first();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'quiz' => $quiz,
                'questions' => $questions,
                'total_questions' => $questions->count(),
                'user_attempts_count' => $attemptsCount,
                'can_attempt' => ($quiz->max_attempts === 0 || $attemptsCount < $quiz->max_attempts),
                'best_attempt' => $bestAttempt,
            ]
        ], 200);
    }

    /**
     * Submit quiz with server-side secure grading.
     */
    public function submit(QuizSubmitRequest $request, $id): JsonResponse
    {
        $user = $request->user();

        $quiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();

        if ($quiz->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'یہ کوئز فعال نہیں ہے۔ (Quiz is not active)',
            ], 400);
        }

        // Check maximum allowed attempts
        if ($quiz->max_attempts > 0) {
            $pastAttempts = QuizAttempt::where('user_id', $user->id)->where('quiz_id', $quiz->id)->count();
            if ($pastAttempts >= $quiz->max_attempts) {
                return response()->json([
                    'success' => false,
                    'message' => 'آپ اس کوئز کے لیے تمام ممکنہ کوششیں مکمل کر چکے ہیں۔ (Maximum attempts reached)',
                ], 403);
            }
        }

        $submittedAnswers = $request->input('answers', []); // map of [question_id => selected_option_index]
        $timeTakenSeconds = (int) $request->input('time_taken_seconds', 0);

        // Fetch real questions with correct answer keys
        $questions = QuizQuestion::where('quiz_id', $quiz->id)->orderBy('order', 'asc')->get();

        $totalQuestions = $questions->count();
        if ($totalQuestions === 0) {
            return response()->json([
                'success' => false,
                'message' => 'اس کوئز میں کوئی سوالات موجود نہیں ہیں۔ (No questions in quiz)',
            ], 400);
        }

        $correctCount = 0;
        $totalPointsEarned = 0;
        $totalMaxPoints = 0;
        $detailedBreakdown = [];

        foreach ($questions as $q) {
            $points = $q->points ?: 1;
            $totalMaxPoints += $points;

            $selectedOption = $submittedAnswers[$q->id] ?? $submittedAnswers[(string)$q->id] ?? null;
            $isCorrect = false;

            if ($selectedOption !== null && (int)$selectedOption === (int)$q->correct_option_index) {
                $isCorrect = true;
                $correctCount++;
                $totalPointsEarned += $points;
            }

            $detailedBreakdown[] = [
                'question_id' => $q->id,
                'question_text' => $q->question_text,
                'question_text_ur' => $q->question_text_ur,
                'options' => $q->options,
                'selected_option' => $selectedOption !== null ? (int)$selectedOption : null,
                'correct_option_index' => $q->correct_option_index,
                'is_correct' => $isCorrect,
                'points_earned' => $isCorrect ? $points : 0,
                'max_points' => $points,
                'explanation' => $q->explanation,
                'explanation_ur' => $q->explanation_ur,
            ];
        }

        $scorePercentage = round(($correctCount / $totalQuestions) * 100, 2);
        $passed = ($scorePercentage >= $quiz->pass_percentage);

        $attemptNumber = QuizAttempt::where('user_id', $user->id)->where('quiz_id', $quiz->id)->count() + 1;

        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctCount,
            'score_percentage' => $scorePercentage,
            'passed' => $passed,
            'time_taken_seconds' => $timeTakenSeconds,
            'user_answers' => $submittedAnswers,
            'detailed_results' => $detailedBreakdown,
            'attempt_number' => $attemptNumber,
        ]);

        // Award Certificate of Excellence if passed with high grade
        $certificateIssued = false;
        $certificate = null;

        if ($passed) {
            $grade = ($scorePercentage >= 90) ? 'Distinction' : (($scorePercentage >= 75) ? 'Merit' : 'Pass');

            $certificate = Certificate::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'quiz_id' => $quiz->id,
                    'type' => 'quiz_excellence',
                ],
                [
                    'recipient_name' => $user->name,
                    'title' => 'Certificate of Quiz Achievement: ' . $quiz->title,
                    'title_ur' => 'سندِ اعزاز و کامیابی: ' . ($quiz->title_ur ?? $quiz->title),
                    'grade' => $grade,
                    'score_percentage' => $scorePercentage,
                    'issued_at' => now(),
                    'metadata' => [
                        'quiz_title' => $quiz->title,
                        'total_questions' => $totalQuestions,
                        'correct_answers' => $correctCount,
                        'attempt_id' => $attempt->id,
                    ]
                ]
            );
            $certificateIssued = true;
        }

        return response()->json([
            'success' => true,
            'message' => $passed 
                ? 'مبارک ہو! آپ نے کوئز کامیابی سے پاس کر لیا ہے۔ (Congratulations! Quiz passed)' 
                : 'آپ کوئز پاس نہیں کر سکے۔ دوبارہ کوشش کریں۔ (Quiz not passed, please try again)',
            'data' => [
                'attempt_id' => $attempt->id,
                'total_questions' => $totalQuestions,
                'correct_answers' => $correctCount,
                'score_percentage' => $scorePercentage,
                'passed' => $passed,
                'pass_percentage_required' => $quiz->pass_percentage,
                'time_taken_seconds' => $timeTakenSeconds,
                'certificate_issued' => $certificateIssued,
                'certificate' => $certificate,
                'results' => $detailedBreakdown,
            ]
        ], 200);
    }

    /**
     * Get user's past attempts history for all or specific quiz.
     */
    public function getAttemptHistory(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = QuizAttempt::where('user_id', $user->id)
            ->with(['quiz:id,title,title_ur,slug,pass_percentage,difficulty'])
            ->orderBy('created_at', 'desc');

        if ($quizId = $request->input('quiz_id')) {
            $query->where('quiz_id', $quizId);
        }

        $attempts = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $attempts->items(),
            'pagination' => [
                'current_page' => $attempts->currentPage(),
                'total' => $attempts->total(),
                'last_page' => $attempts->lastPage(),
            ]
        ], 200);
    }
}
