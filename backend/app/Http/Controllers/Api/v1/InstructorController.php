<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\InstructorApplication;
use App\Models\InstructorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    /**
     * Submit an application to become an instructor.
     */
    public function apply(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user is already an instructor
        if ($user->isInstructor()) {
            return response()->json([
                'success' => false,
                'message' => 'آپ پہلے سے ہی رجسٹرڈ استاد ہیں۔ (You are already an approved instructor)',
            ], 400);
        }

        // Check if there is an existing pending application
        $existing = InstructorApplication::where('user_id', $user->id)
            ->whereIn('status', ['submitted', 'under_review'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'آپ کی درخواست پہلے سے زیرِ جائزہ ہے۔ (Your application is already under review)',
                'data' => $existing
            ], 400);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'bio' => 'required|string|max:2000',
            'expertise' => 'required|array|min:1',
            'qualifications' => 'required|string|max:500',
            'experience_years' => 'required|integer|min:1|max:60',
            'teaching_languages' => 'required|array|min:1',
            'phone' => 'nullable|string|max:30',
            'country' => 'nullable|string|max:100',
            'motivation' => 'nullable|string|max:1500',
            'documents' => 'nullable|array',
        ]);

        $application = InstructorApplication::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'bio' => $validated['bio'],
            'expertise' => $validated['expertise'],
            'qualifications' => $validated['qualifications'],
            'experience_years' => (int) $validated['experience_years'],
            'teaching_languages' => $validated['teaching_languages'],
            'phone' => $validated['phone'] ?? $user->phone,
            'country' => $validated['country'] ?? $user->country ?? 'PK',
            'motivation' => $validated['motivation'] ?? '',
            'documents' => $validated['documents'] ?? [],
            'status' => 'submitted',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'استاد بننے کی درخواست کامیابی سے موصول ہو گئی ہے۔ ایڈمنسٹریشن جلد جائزہ لے گی۔',
            'data' => $application
        ], 201);
    }

    /**
     * Get the authenticated user's instructor application status.
     */
    public function getApplicationStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        $application = InstructorApplication::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'is_instructor' => $user->isInstructor(),
                'application' => $application,
            ]
        ], 200);
    }

    /**
     * Instructor Dashboard telemetry and overview.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isInstructor() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'صرف مستند اساتذہ ہی اس ڈیش بورڈ تک رسائی حاصل کر سکتے ہیں۔ (Instructor access required)',
            ], 403);
        }

        $profile = InstructorProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'title' => $user->headline ?? 'استاذ و محقق',
                'bio' => $user->bio ?? '',
                'rating' => 5.0,
            ]
        );

        $courses = Course::where('instructor_id', $user->id)->get();
        $courseIds = $courses->pluck('id');

        $enrollments = CourseEnrollment::whereIn('course_id', $courseIds)
            ->with(['user:id,name,email,avatar', 'course:id,title,title_ur'])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalStudents = $enrollments->pluck('user_id')->unique()->count();
        $completionsCount = $enrollments->where('progress', '>=', 100)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => $profile,
                'metrics' => [
                    'total_courses' => $courses->count(),
                    'published_courses' => $courses->where('status', 'published')->count(),
                    'draft_courses' => $courses->where('status', 'draft')->count(),
                    'total_students' => $totalStudents,
                    'total_enrollments' => $enrollments->count(),
                    'completions_count' => $completionsCount,
                    'average_rating' => $profile->rating,
                ],
                'recent_enrollments' => $enrollments->take(5),
                'courses' => $courses,
            ]
        ], 200);
    }

    /**
     * Get courses owned by the authenticated instructor.
     */
    public function myCourses(Request $request): JsonResponse
    {
        $user = $request->user();

        $courses = Course::where('instructor_id', $user->id)
            ->withCount(['lessons', 'enrollments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses
        ], 200);
    }

    /**
     * Create a new course by instructor.
     */
    public function storeCourse(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_ur' => 'nullable|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable',
            'level' => 'required|in:beginner,intermediate,advanced,all',
            'duration_hours' => 'nullable|numeric|min:0.5',
            'price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|string',
            'promo_video' => 'nullable|string',
        ]);

        $course = Course::create([
            'instructor_id' => $user->id,
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'title_ur' => $validated['title_ur'] ?? $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . rand(1000, 9999),
            'description' => $validated['description'],
            'level' => $validated['level'],
            'duration_hours' => $validated['duration_hours'] ?? 5,
            'price' => $validated['price'] ?? 0,
            'is_free' => empty($validated['price']),
            'thumbnail' => $validated['thumbnail'] ?? 'https://images.unsplash.com/photo-1584281722573-cf6a528fb483?auto=format&fit=crop&q=80&w=600',
            'promo_video' => $validated['promo_video'] ?? null,
            'status' => 'draft', // Requires admin approval to publish
            'featured' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'کورس کامیابی سے بنا دیا گیا ہے۔ اسباق شامل کر کے ایڈمن ریویو کے لیے جمع کرائیں۔',
            'data' => $course
        ], 201);
    }

    /**
     * Get students enrolled in this instructor's courses.
     */
    public function myStudents(Request $request): JsonResponse
    {
        $user = $request->user();

        $courseIds = Course::where('instructor_id', $user->id)->pluck('id');

        $students = CourseEnrollment::whereIn('course_id', $courseIds)
            ->with(['user:id,name,email,avatar,country', 'course:id,title,title_ur'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $students->items(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'total' => $students->total(),
                'last_page' => $students->lastPage(),
            ]
        ], 200);
    }

    /**
     * Public Instructor Directory.
     */
    public function directory(Request $request): JsonResponse
    {
        $instructors = User::where('role', 'instructor')
            ->where('status', 'active')
            ->with(['instructorProfile', 'instructedCourses:id,instructor_id,title,title_ur,thumbnail,level,rating'])
            ->withCount('instructedCourses')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $instructors
        ], 200);
    }

    /**
     * Public Instructor Profile with courses & bio.
     */
    public function publicProfile($id): JsonResponse
    {
        $instructor = User::where('role', 'instructor')
            ->where('id', $id)
            ->with(['instructorProfile', 'instructedCourses' => function($q) {
                $q->where('status', 'published');
            }])
            ->first();

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'استاد کا پروفائل نہیں ملا۔ (Instructor not found)',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $instructor
        ], 200);
    }
}
