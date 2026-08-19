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

    /* =========================================================================
       ADMIN QUIZ MANAGEMENT SUITE ENDPOINTS
       ========================================================================= */

    /**
     * Admin: Create new standalone quiz.
     */
    public function adminStore(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable',
            'difficulty' => 'required|in:beginner,intermediate,advanced,Beginner,Intermediate,Advanced',
            'time_limit_minutes' => 'required|integer|min:1|max:300',
            'passing_percentage' => 'required|integer|min:1|max:100',
            'max_attempts' => 'nullable|integer|min:0',
        ]);

        $quiz = Quiz::create([
            'title' => $request->input('title'),
            'title_ur' => $request->input('title_ur', $request->input('title')),
            'slug' => \Illuminate\Support\Str::slug($request->input('title')) . '-' . rand(1000, 9999),
            'category_id' => $request->input('category_id'),
            'difficulty' => strtolower($request->input('difficulty')),
            'description' => $request->input('description', ''),
            'time_limit_minutes' => (int) $request->input('time_limit_minutes', 15),
            'pass_percentage' => (int) $request->input('passing_percentage', 70),
            'max_attempts' => (int) $request->input('max_attempts', 0),
            'status' => $request->input('status', 'published'),
            'randomize_questions' => (bool) $request->input('randomize_questions', false),
            'randomize_options' => (bool) $request->input('randomize_options', false),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'نیا کوئز کامیابی سے بنا دیا گیا ہے۔ (Quiz created successfully)',
            'data' => $quiz
        ], 201);
    }

    /**
     * Admin: Update quiz details and settings.
     */
    public function adminUpdate(Request $request, $id): JsonResponse
    {
        $quiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();

        $quiz->update([
            'title' => $request->input('title', $quiz->title),
            'title_ur' => $request->input('title_ur', $quiz->title_ur),
            'category_id' => $request->input('category_id', $quiz->category_id),
            'difficulty' => $request->has('difficulty') ? strtolower($request->input('difficulty')) : $quiz->difficulty,
            'description' => $request->input('description', $quiz->description),
            'time_limit_minutes' => (int) $request->input('time_limit_minutes', $quiz->time_limit_minutes),
            'pass_percentage' => (int) $request->input('passing_percentage', $quiz->pass_percentage),
            'max_attempts' => (int) $request->input('max_attempts', $quiz->max_attempts),
            'status' => $request->input('status', $quiz->status),
            'randomize_questions' => $request->has('randomize_questions') ? (bool) $request->input('randomize_questions') : $quiz->randomize_questions,
            'randomize_options' => $request->has('randomize_options') ? (bool) $request->input('randomize_options') : $quiz->randomize_options,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'کوئز کی تفصیلات اپ ڈیٹ ہو گئی ہیں۔ (Quiz updated successfully)',
            'data' => $quiz
        ], 200);
    }

    /**
     * Admin: Delete quiz.
     */
    public function adminDelete($id): JsonResponse
    {
        $quiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();
        QuizQuestion::where('quiz_id', $quiz->id)->delete();
        $quiz->delete();

        return response()->json([
            'success' => true,
            'message' => 'کوئز کامیابی سے ڈیلیٹ کر دیا گیا ہے۔ (Quiz deleted successfully)'
        ], 200);
    }

    /**
     * Admin: Duplicate/Clone a quiz with its complete question bank.
     */
    public function adminDuplicate($id): JsonResponse
    {
        $originalQuiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();

        $newQuiz = $originalQuiz->replicate([
            'slug',
            'created_at',
            'updated_at'
        ]);
        $newQuiz->title = $originalQuiz->title . ' (کاپی)';
        $newQuiz->title_ur = ($originalQuiz->title_ur ?? $originalQuiz->title) . ' (نقل)';
        $newQuiz->slug = \Illuminate\Support\Str::slug($newQuiz->title) . '-' . rand(1000, 9999);
        $newQuiz->status = 'draft';
        $newQuiz->save();

        // Replicate questions
        $questions = QuizQuestion::where('quiz_id', $originalQuiz->id)->get();
        foreach ($questions as $q) {
            $newQ = $q->replicate(['quiz_id', 'created_at', 'updated_at']);
            $newQ->quiz_id = $newQuiz->id;
            $newQ->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'کوئز کامیابی سے نقل (Duplicate) کر لیا گیا ہے۔',
            'data' => $newQuiz
        ], 201);
    }

    /**
     * Admin: Get quiz analytics & attempts data.
     */
    public function adminAnalytics($id): JsonResponse
    {
        $quiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();

        $attempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->with(['user:id,name,email,avatar'])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalAttempts = $attempts->count();
        $passedCount = $attempts->where('passed', true)->count();
        $passRate = $totalAttempts > 0 ? round(($passedCount / $totalAttempts) * 100, 1) : 100;
        $avgScore = $totalAttempts > 0 ? round($attempts->avg('score_percentage'), 1) : 0;
        $avgTime = $totalAttempts > 0 ? round($attempts->avg('time_taken_seconds') / 60, 1) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'quiz' => $quiz,
                'metrics' => [
                    'total_attempts' => $totalAttempts,
                    'passed_attempts' => $passedCount,
                    'failed_attempts' => $totalAttempts - $passedCount,
                    'pass_rate' => $passRate,
                    'average_score' => $avgScore,
                    'average_time_minutes' => $avgTime,
                ],
                'attempts' => $attempts
            ]
        ], 200);
    }

    /**
     * Admin: Get quiz questions bank.
     */
    public function adminGetQuestions($id): JsonResponse
    {
        $quiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();
        $questions = QuizQuestion::where('quiz_id', $quiz->id)->orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'quiz' => $quiz,
                'questions' => $questions
            ]
        ], 200);
    }

    /**
     * Admin: Save (Create or Update) question in quiz.
     */
    public function adminSaveQuestion(Request $request, $id): JsonResponse
    {
        $quiz = Quiz::where('id', $id)->orWhere('slug', $id)->firstOrFail();

        $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_option_index' => 'required|integer',
            'points' => 'nullable|integer|min:1',
        ]);

        $questionId = $request->input('id');

        if ($questionId) {
            $question = QuizQuestion::where('quiz_id', $quiz->id)->where('id', $questionId)->firstOrFail();
            $question->update([
                'question_text' => $request->input('question_text'),
                'question_text_ur' => $request->input('question_text_ur', $request->input('question_text')),
                'options' => $request->input('options'),
                'correct_option_index' => (int) $request->input('correct_option_index'),
                'points' => (int) $request->input('points', 10),
                'explanation' => $request->input('explanation', ''),
                'explanation_ur' => $request->input('explanation_ur', ''),
            ]);
        } else {
            $maxOrder = QuizQuestion::where('quiz_id', $quiz->id)->max('order') ?: 0;
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question_text' => $request->input('question_text'),
                'question_text_ur' => $request->input('question_text_ur', $request->input('question_text')),
                'options' => $request->input('options'),
                'correct_option_index' => (int) $request->input('correct_option_index'),
                'points' => (int) $request->input('points', 10),
                'order' => $maxOrder + 1,
                'explanation' => $request->input('explanation', ''),
                'explanation_ur' => $request->input('explanation_ur', ''),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'سوال کامیابی سے محفوظ کر لیا گیا ہے۔ (Question saved successfully)',
            'data' => $question
        ], 200);
    }

    /**
     * Admin: Delete question from quiz.
     */
    public function adminDeleteQuestion($quizId, $questionId): JsonResponse
    {
        QuizQuestion::where('quiz_id', $quizId)->where('id', $questionId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'سوال کامیابی سے حذف کر دیا گیا ہے۔ (Question deleted successfully)'
        ], 200);
    }
}

