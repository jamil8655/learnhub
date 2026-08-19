<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\InstructorApplication;
use App\Models\InstructorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminInstructorController extends Controller
{
    /**
     * List all instructor applications for admin review.
     */
    public function applications(Request $request): JsonResponse
    {
        $query = InstructorApplication::with(['user:id,name,email,avatar,country,phone'])
            ->orderBy('created_at', 'desc');

        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $applications = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications->items(),
            'pagination' => [
                'current_page' => $applications->currentPage(),
                'total' => $applications->total(),
                'last_page' => $applications->lastPage(),
            ]
        ], 200);
    }

    /**
     * Approve an instructor application and promote the user to Instructor role.
     */
    public function approveApplication(Request $request, $id): JsonResponse
    {
        $application = InstructorApplication::findOrFail($id);
        $user = User::findOrFail($application->user_id);

        // 1. Promote User Role
        $user->update([
            'role' => 'instructor',
            'headline' => $application->title,
            'bio' => $application->bio,
        ]);

        // 2. Create or Update Instructor Profile
        InstructorProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'title' => $application->title,
                'bio' => $application->bio,
                'expertise' => $application->expertise,
                'qualifications' => $application->qualifications,
                'experience_years' => $application->experience_years,
                'is_active' => true,
            ]
        );

        // 3. Mark Application as Approved
        $application->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->input('admin_notes', 'درخواست منظور کر لی گئی ہے۔'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'استاد کی درخواست منظور کر لی گئی ہے اور صارف کو استاد کا رول تفویض کر دیا گیا ہے۔',
            'data' => [
                'user' => $user,
                'application' => $application,
            ]
        ], 200);
    }

    /**
     * Reject an instructor application with reason.
     */
    public function rejectApplication(Request $request, $id): JsonResponse
    {
        $application = InstructorApplication::findOrFail($id);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('rejection_reason', 'معیار پر پورا نہ اترنے کی وجہ سے درخواست مسترد کی گئی ہے۔'),
            'admin_notes' => $request->input('admin_notes'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'درخواست مسترد کر دی گئی ہے۔',
            'data' => $application
        ], 200);
    }

    /**
     * Request more information/documents from the applicant.
     */
    public function requestMoreInfo(Request $request, $id): JsonResponse
    {
        $application = InstructorApplication::findOrFail($id);

        $request->validate([
            'admin_notes' => 'required|string',
        ]);

        $application->update([
            'status' => 'more_info_required',
            'admin_notes' => $request->input('admin_notes'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'مزید معلومات اور اسناد کی فراہمی کا نوٹس بھیج دیا گیا ہے۔',
            'data' => $application
        ], 200);
    }

    /**
     * List all instructors in the system.
     */
    public function instructorsList(Request $request): JsonResponse
    {
        $query = User::where('role', 'instructor')
            ->with(['instructorProfile', 'instructedCourses:id,instructor_id,title,title_ur,status,price'])
            ->withCount('instructedCourses')
            ->orderBy('created_at', 'desc');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $instructors = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $instructors->items(),
            'pagination' => [
                'current_page' => $instructors->currentPage(),
                'total' => $instructors->total(),
                'last_page' => $instructors->lastPage(),
            ]
        ], 200);
    }

    /**
     * Suspend or Reactivate an instructor.
     */
    public function toggleStatus(Request $request, $id): JsonResponse
    {
        $instructor = User::where('role', 'instructor')->findOrFail($id);
        $newStatus = $instructor->status === 'active' ? 'suspended' : 'active';

        $instructor->update(['status' => $newStatus]);

        if ($profile = InstructorProfile::where('user_id', $instructor->id)->first()) {
            $profile->update(['is_active' => ($newStatus === 'active')]);
        }

        return response()->json([
            'success' => true,
            'message' => $newStatus === 'active' ? 'استاد کا اکاؤنٹ بحال کر دیا گیا ہے۔' : 'استاد کا اکاؤنٹ معطل کر دیا گیا ہے۔',
            'data' => $instructor
        ], 200);
    }

    /**
     * Revoke instructor role and demote to student safely without deleting historical content.
     */
    public function removeRole(Request $request, $id): JsonResponse
    {
        $instructor = User::where('role', 'instructor')->findOrFail($id);

        $courseAction = $request->input('course_action', 'keep_published'); // keep_published, unpublish, transfer

        if ($courseAction === 'unpublish') {
            Course::where('instructor_id', $instructor->id)->update(['status' => 'draft']);
        } elseif ($courseAction === 'transfer' && $newInstructorId = $request->input('new_instructor_id')) {
            Course::where('instructor_id', $instructor->id)->update(['instructor_id' => $newInstructorId]);
        }

        $instructor->update(['role' => 'student']);

        return response()->json([
            'success' => true,
            'message' => 'استاد کا رول کامیابی سے ختم کر کے طالب علم بنا دیا گیا ہے اور کورسز کے حقوق محفوظ کر لیے گئے ہیں۔'
        ], 200);
    }

    /**
     * Transfer a course from one instructor to another.
     */
    public function transferCourse(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'target_instructor_id' => 'required|exists:users,id',
        ]);

        $course = Course::findOrFail($request->input('course_id'));
        $targetInstructor = User::where('role', 'instructor')->findOrFail($request->input('target_instructor_id'));

        $course->update(['instructor_id' => $targetInstructor->id]);

        return response()->json([
            'success' => true,
            'message' => "کورس '{$course->title}' کامیابی سے استاذ {$targetInstructor->name} کو منتقل کر دیا گیا ہے۔",
            'data' => $course
        ], 200);
    }
}
