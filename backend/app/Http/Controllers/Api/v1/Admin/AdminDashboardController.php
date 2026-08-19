<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Certificate;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get system KPIs and core summary metrics.
     */
    public function kpis(Request $request): JsonResponse
    {
        $totalUsers = User::count();
        $activeStudents = User::where('role', 'student')->where('status', 'active')->count();
        $totalCourses = Course::count();
        $publishedCourses = Course::where('status', 'published')->count();
        $totalQuizzes = Quiz::count();
        $totalEnrollments = CourseEnrollment::count();
        $completedEnrollments = CourseEnrollment::where('status', 'completed')->count();
        $totalCertificates = Certificate::count();
        
        $totalRevenue = CourseEnrollment::where('payment_status', 'paid')->sum('amount_paid');

        // Quiz Pass Rate
        $totalAttempts = QuizAttempt::count();
        $passedAttempts = QuizAttempt::where('passed', true)->count();
        $quizPassRate = $totalAttempts > 0 ? round(($passedAttempts / $totalAttempts) * 100, 1) : 0;

        // Overall Course Completion Rate
        $courseCompletionRate = $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100, 1) : 0;

        // Recent Audit Logs
        $recentAuditLogs = AuditLog::with('user:id,name,email,role')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'active_students' => $activeStudents,
                'total_courses' => $totalCourses,
                'published_courses' => $publishedCourses,
                'total_quizzes' => $totalQuizzes,
                'total_enrollments' => $totalEnrollments,
                'completed_enrollments' => $completedEnrollments,
                'total_certificates_issued' => $totalCertificates,
                'total_revenue' => (float) $totalRevenue,
                'currency' => 'PKR',
                'quiz_pass_rate' => $quizPassRate,
                'course_completion_rate' => $courseCompletionRate,
                'recent_audit_logs' => $recentAuditLogs,
            ]
        ], 200);
    }

    /**
     * Get monthly/weekly analytics and visual trend data.
     */
    public function analytics(Request $request): JsonResponse
    {
        $days = (int) $request->input('days', 30);

        // Daily Enrollments for the past N days
        $enrollmentTrends = CourseEnrollment::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count'),
                DB::raw('sum(amount_paid) as revenue')
            )
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Daily Quiz Attempts
        $quizTrends = QuizAttempt::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total_attempts'),
                DB::raw('sum(case when passed = 1 then 1 else 0 end) as passed_attempts')
            )
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Top Enrolled Courses
        $topCourses = Course::select('id', 'title', 'title_ur', 'enrolled_count', 'rating', 'price', 'is_free')
            ->orderBy('enrolled_count', 'desc')
            ->limit(5)
            ->get();

        // User Demographics / Roles
        $usersByRole = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->pluck('count', 'role');

        return response()->json([
            'success' => true,
            'data' => [
                'timeframe_days' => $days,
                'enrollment_trends' => $enrollmentTrends,
                'quiz_trends' => $quizTrends,
                'top_courses' => $topCourses,
                'user_roles_distribution' => $usersByRole,
            ]
        ], 200);
    }
}
