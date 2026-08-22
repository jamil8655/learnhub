<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /** List published courses with safe filtering, sorting and pagination. */
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['category:id,name,name_ur,slug', 'instructor:id,name,avatar'])
            ->withCount('lessons');

        $user = $request->user('sanctum');
        $isAdmin = $user && $user->isAdmin();

        if (!$isAdmin) {
            $query->where('status', 'published');
        } elseif ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($search = trim($request->string('search')->toString())) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('title_ur', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('short_description_ur', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            if ($category !== 'all') {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category)->orWhere('id', $category);
                });
            }
        }

        if ($level = $request->input('level')) {
            if ($level !== 'all') {
                $query->where('level', strtolower((string) $level));
            }
        }

        if ($priceType = $request->input('priceType')) {
            if ($priceType === 'free') {
                $query->where('is_free', true);
            } elseif ($priceType === 'paid') {
                $query->where('is_free', false);
            }
        }

        if ($request->filled('minRating')) {
            $query->where('rating', '>=', max(0, min(5, (float) $request->input('minRating'))));
        }

        switch ($request->input('sort', 'popular')) {
            case 'rating':
                $query->orderByDesc('rating')->orderByDesc('rating_count');
                break;
            case 'newest':
                $query->latest();
                break;
            case 'price_asc':
                $query->orderBy('price')->orderBy('id');
                break;
            case 'price_desc':
                $query->orderByDesc('price')->orderBy('id');
                break;
            case 'popular':
            default:
                $query->orderByDesc('enrolled_count')->orderByDesc('rating');
                break;
        }

        $perPage = max(1, min((int) $request->input('per_page', 12), 50));
        $courses = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $courses->items(),
            'pagination' => [
                'current_page' => $courses->currentPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
                'last_page' => $courses->lastPage(),
            ],
        ]);
    }

    /** Get a course and, when authenticated, the current user's progress. */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user('sanctum');

        $course = Course::with([
            'category:id,name,name_ur,slug',
            'instructor:id,name,avatar,bio',
            'lessons' => fn ($q) => $q->where('status', 'published')->orderBy('order'),
        ])->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('slug', $id);
        })->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'کورس نہیں ملا۔ (Course not found)'], 404);
        }

        if ($course->status !== 'published' && (!$user || (!$user->isAdmin() && $user->id !== $course->instructor_id))) {
            return response()->json(['success' => false, 'message' => 'یہ کورس فی الحال دستیاب نہیں ہے۔ (Course is not published)'], 403);
        }

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
                ->all();
        }

        $courseData = $course->toArray();
        $courseData['is_enrolled'] = $enrollment !== null;
        $courseData['enrollment'] = $enrollment;
        $courseData['completed_lesson_ids'] = $completedLessonIds;

        return response()->json(['success' => true, 'data' => $courseData]);
    }

    /** Enroll an authenticated user. Paid courses require a trusted payment confirmation. */
    public function enroll(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $course = Course::where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('slug', $id);
        })->first();

        if (!$course || $course->status !== 'published') {
            return response()->json(['success' => false, 'message' => 'کورس دستیاب نہیں ہے۔ (Course not found or unavailable)'], 404);
        }

        $existing = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'آپ پہلے ہی اس کورس میں داخل ہیں۔ (Already enrolled in this course)',
                'data' => ['enrollment' => $existing, 'course' => $course],
            ]);
        }

        // Never trust a client-supplied "paid" flag. The payment provider/webhook must
        // create/confirm a payment before a paid course can be activated.
        if (!$course->is_free) {
            return response()->json([
                'success' => false,
                'message' => 'ادائیگی مکمل کرنا ضروری ہے۔ (Payment is required before enrollment)',
                'code' => 'PAYMENT_REQUIRED',
                'amount' => (float) $course->price,
                'currency' => 'USD',
            ], 402);
        }

        $enrollment = DB::transaction(function () use ($user, $course) {
            $enrollment = CourseEnrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'status' => 'active',
                'progress_percentage' => 0.0,
                'enrolled_at' => now(),
                'payment_status' => 'free',
                'amount_paid' => 0,
            ]);

            $course->increment('enrolled_count');
            return $enrollment;
        });

        return response()->json([
            'success' => true,
            'message' => 'کورس میں داخلہ کامیابی سے مکمل ہو گیا ہے۔ (Enrolled successfully in course)',
            'data' => ['enrollment' => $enrollment, 'course' => $course->fresh()],
        ], 201);
    }

    /** Update lesson progress for an active enrollment and issue a certificate on completion. */
    public function lessonProgress(Request $request, $courseId, $lessonId): JsonResponse
    {
        $user = $request->user();
        $request->validate([
            'is_completed' => ['sometimes', 'boolean'],
            'last_watched_seconds' => ['sometimes', 'integer', 'min:0'],
        ]);

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $lesson = Lesson::where('course_id', $course->id)
            ->where('id', $lessonId)
            ->where('status', 'published')
            ->first();

        if (!$lesson) {
            return response()->json(['success' => false, 'message' => 'Lesson not found or unavailable'], 404);
        }

        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['active', 'completed'])
            ->first();

        if (!$enrollment) {
            return response()->json(['success' => false, 'message' => 'پہلے اس کورس میں داخلہ لیں۔ (Please enroll in this course first)'], 403);
        }

        $isCompleted = $request->boolean('is_completed', true);
        $lastWatchedSeconds = (int) $request->input('last_watched_seconds', 0);

        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id, 'course_id' => $course->id],
            [
                'is_completed' => $isCompleted,
                'last_watched_seconds' => $lastWatchedSeconds,
                'completed_at' => $isCompleted ? now() : null,
            ]
        );

        $totalLessons = Lesson::where('course_id', $course->id)->where('status', 'published')->count();
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('is_completed', true)
            ->count();
        $percentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0;

        $certificate = null;
        $certificateIssued = false;

        DB::transaction(function () use (&$certificate, &$certificateIssued, $enrollment, $user, $course, $percentage, $totalLessons) {
            $enrollment->progress_percentage = $percentage;

            if ($percentage >= 100) {
                $enrollment->status = 'completed';
                $enrollment->completed_at = $enrollment->completed_at ?? now();

                $certificate = Certificate::firstOrCreate(
                    ['user_id' => $user->id, 'course_id' => $course->id, 'type' => 'course_completion'],
                    [
                        'recipient_name' => $user->name,
                        'title' => 'Certificate of Completion: ' . $course->title,
                        'title_ur' => 'سندِ فراغت: ' . ($course->title_ur ?? $course->title),
                        'grade' => 'Distinction',
                        'score_percentage' => 100.0,
                        'issued_at' => now(),
                        'metadata' => ['course_title' => $course->title, 'total_lessons' => $totalLessons],
                    ]
                );
                $certificateIssued = $certificate->wasRecentlyCreated;
            }

            $enrollment->save();
        });

        return response()->json([
            'success' => true,
            'message' => 'سبق کی پیش رفت محفوظ کر لی گئی ہے۔ (Lesson progress updated)',
            'data' => [
                'lesson_progress' => $progress,
                'course_progress_percentage' => $percentage,
                'is_course_completed' => $percentage >= 100,
                'certificate_issued' => $certificateIssued,
                'certificate' => $certificate,
            ],
        ]);
    }

    /** Admin-only course creation. */
    public function adminStore(Request $request): JsonResponse
    {
        $data = $this->validateCourse($request);
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['title']);
        $course = Course::create($data);

        return response()->json(['success' => true, 'data' => $course->load(['category', 'instructor'])], 201);
    }

    /** Admin-only course update. */
    public function adminUpdate(Request $request, $id): JsonResponse
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $data = $this->validateCourse($request, $course->id);
        if (array_key_exists('slug', $data) || array_key_exists('title', $data)) {
            $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['title'], $course->id);
        }
        $course->update($data);

        return response()->json(['success' => true, 'data' => $course->fresh()->load(['category', 'instructor'])]);
    }

    /** Admin-only course deletion. Keep enrollment history by archiving instead of hard deletion. */
    public function adminDelete($id): JsonResponse
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $course->update(['status' => 'archived']);
        return response()->json(['success' => true, 'message' => 'Course archived successfully']);
    }

    private function validateCourse(Request $request, $ignoreId = null): array
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'instructor_id' => ['nullable', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('courses', 'slug')->ignore($ignoreId)],
            'thumbnail' => ['nullable', 'url', 'max:2048'],
            'badge' => ['nullable', 'string', 'max:100'],
            'level' => ['required', 'string', 'max:50'],
            'language' => ['nullable', 'string', 'max:20'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'is_free' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['sometimes', Rule::in(['draft', 'published', 'archived'])],
            'rating' => ['sometimes', 'numeric', 'min:0', 'max:5'],
            'rating_count' => ['sometimes', 'integer', 'min:0'],
            'duration_hours' => ['sometimes', 'numeric', 'min:0'],
            'short_description' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'learning_outcomes' => ['nullable', 'array'],
            'learning_outcomes.*' => ['string', 'max:500'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string', 'max:500'],
        ]);

        if (!empty($validated['is_free'])) {
            $validated['price'] = 0;
        }

        return $validated;
    }

    private function uniqueSlug(string $value, $ignoreId = null): string
    {
        $base = trim(strtolower(preg_replace('/[^a-z0-9]+/i', '-', $value) ?? 'course'), '-');
        $base = $base !== '' ? $base : 'course';
        $slug = $base;
        $suffix = 2;

        while (Course::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }
}
