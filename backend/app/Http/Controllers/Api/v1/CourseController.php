<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\CourseEnrollment;
use App\Models\LessonProgress;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    /**
     * List all published courses with search, filtering, and sorting.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['category:id,name,name_ur,slug', 'instructor:id,name,avatar'])
            ->withCount('lessons');

        // Only show published courses unless admin/instructor explicitly requests all
        $user = $request->user('sanctum');
        if (!$user || !$user->isAdmin()) {
            $query->where('status', 'published');
        } elseif ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Search in title, short_description, description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('title_ur', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('short_description_ur', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($category = $request->input('category')) {
            if ($category !== 'all') {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category)->orWhere('id', $category);
                });
            }
        }

        // Level filter
        if ($level = $request->input('level')) {
            if ($level !== 'all') {
                $query->where('level', strtolower($level));
            }
        }

        // Price filter
        if ($priceType = $request->input('priceType')) {
            if ($priceType === 'free') {
                $query->where('is_free', true);
            } elseif ($priceType === 'paid') {
                $query->where('is_free', false);
            }
        }

        // Minimum rating filter
        if ($minRating = $request->input('minRating')) {
            $query->where('rating', '>=', (float) $minRating);
        }

        // Sorting
        $sort = $request->input('sort', 'popular');
        switch ($sort) {
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
            default:
                $query->orderBy('enrolled_count', 'desc');
                break;
        }

        $perPage = min((int) $request->input('per_page', 12), 50);
        $courses = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $courses->items(),
            'pagination' => [
                'current_page' => $courses->currentPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
                'last_page' => $courses->lastPage(),
            ]
        ], 200);
    }

    /**
     * Get single course details with lessons and user enrollment progress.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user('sanctum');

        $course = Course::with([
            'category:id,name,name_ur,slug',
            'instructor:id,name,avatar,bio',
            'lessons' => function ($q) {
                $q->where('status', 'published')->orderBy('order', 'asc');
            }
        ])->where('id', $id)->orWhere('slug', $id)->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'کورس نہیں ملا۔ (Course not found)',
            ], 404);
        }

        if ($course->status !== 'published' && (!$user || (!$user->isAdmin() && $user->id !== $course->instructor_id))) {
            return response()->json([
                'success' => false,
                'message' => 'یہ کورس فی الحال دستیاب نہیں ہے۔ (Course is not published)',
            ], 403);
        }

        // Enrollment details if authenticated
        $enrollment = null;
        $completedLessonIds = [];

        if ($user) {
            $enrollment = CourseEnrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();

            $completedLessonIds = LessonProgress::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->where('is_completed', true)
                ->pluck('lesson_id')
                ->toArray();
        }

        $courseData = $course->toArray();
        $courseData['is_enrolled'] = !is_null($enrollment);
        $courseData['enrollment'] = $enrollment;
        $courseData['completed_lesson_ids'] = $completedLessonIds;

        return response()->json([
            'success' => true,
            'data' => $courseData,
        ], 200);
    }

    /**
     * Enroll authenticated user into a course.
     */
    public function enroll(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $course = Course::where('id', $id)->orWhere('slug', $id)->first();

        if (!$course || $course->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'کورس دستیاب نہیں ہے۔ (Course not found or unavailable)',
            ], 404);
        }

        $existing = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'آپ پہلے ہی اس کورس میں داخل ہیں۔ (Already enrolled in this course)',
                'data' => [
                    'enrollment' => $existing,
                    'course' => $course,
                ]
            ], 200);
        }

        // For paid courses, verify payment or simulate standard checkout enrollment
        $paymentStatus = $course->is_free ? 'free' : ($request->input('payment_status', 'paid'));
        $amountPaid = $course->is_free ? 0 : ($course->discount_price ?? $course->price);

        $enrollment = CourseEnrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'progress_percentage' => 0.0,
            'enrolled_at' => now(),
            'payment_status' => $paymentStatus,
            'amount_paid' => $amountPaid,
        ]);

        $course->increment('enrolled_count');

        return response()->json([
            'success' => true,
            'message' => 'کورس میں داخلہ کامیابی سے مکمل ہو گیا ہے۔ (Enrolled successfully in course)',
            'data' => [
                'enrollment' => $enrollment,
                'course' => $course,
            ]
        ], 201);
    }

    /**
     * Update lesson progress and recalculate total course completion percentage.
     */
    public function lessonProgress(Request $request, $courseId, $lessonId): JsonResponse
    {
        $user = $request->user();

        $course = Course::findOrFail($courseId);
        $lesson = Lesson::where('course_id', $course->id)->where('id', $lessonId)->firstOrFail();

        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'پہلے اس کورس میں داخلہ لیں۔ (Please enroll in this course first)',
            ], 403);
        }

        $isCompleted = $request->boolean('is_completed', true);
        $lastWatchedSeconds = (int) $request->input('last_watched_seconds', 0);

        $progress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
                'course_id' => $course->id,
            ],
            [
                'is_completed' => $isCompleted,
                'last_watched_seconds' => $lastWatchedSeconds,
                'completed_at' => $isCompleted ? now() : null,
            ]
        );

        // Recalculate Course Total Progress
        $totalLessons = Lesson::where('course_id', $course->id)->where('status', 'published')->count();
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('is_completed', true)
            ->count();

        $percentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 100;

        $enrollment->progress_percentage = $percentage;
        $certificateIssued = false;
        $certificate = null;

        if ($percentage >= 100) {
            $enrollment->status = 'completed';
            $enrollment->completed_at = $enrollment->completed_at ?? now();

            // Check if Certificate already exists, otherwise generate Certificate
            $certificate = Certificate::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'type' => 'course_completion',
                ],
                [
                    'recipient_name' => $user->name,
                    'title' => 'Certificate of Completion: ' . $course->title,
                    'title_ur' => 'سندِ فراغت: ' . ($course->title_ur ?? $course->title),
                    'grade' => 'Distinction',
                    'score_percentage' => 100.0,
                    'issued_at' => now(),
                    'metadata' => [
                        'course_title' => $course->title,
                        'total_lessons' => $totalLessons,
                    ]
                ]
            );
            $certificateIssued = true;
        }
        $enrollment->save();

        return response()->json([
            'success' => true,
            'message' => 'سبق کی پیش رفت محفوظ کر لی گئی ہے۔ (Lesson progress updated)',
            'data' => [
                'lesson_progress' => $progress,
                'course_progress_percentage' => $percentage,
                'is_course_completed' => ($percentage >= 100),
                'certificate_issued' => $certificateIssued,
                'certificate' => $certificate,
            ]
        ], 200);
    }
}
