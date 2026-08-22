<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    /**
     * List all users with search, role, and status filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->withCount(['enrollments', 'quizAttempts', 'certificates']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            if ($role !== 'all') {
                $query->where('role', $role);
            }
        }

        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ]
        ], 200);
    }

    /**
     * Update user role (student, instructor, admin).
     */
    public function updateRole(Request $request, $id): JsonResponse
    {
        $request->validate([
            'role' => ['required', 'in:student,instructor,admin'],
        ]);

        $admin = $request->user();
        $targetUser = User::findOrFail($id);

        if ($targetUser->id === $admin->id && $request->input('role') !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'آپ خود اپنا ایڈمن کا عہدہ تبدیل نہیں کر سکتے۔ (Cannot revoke your own admin role)',
            ], 403);
        }

        $oldRole = $targetUser->role;
        $newRole = $request->input('role');

        $targetUser->role = $newRole;
        $targetUser->save();

        // Sync with Firebase Custom Claims if Firebase is configured
        try {
            $firebase = app(\App\Services\FirebaseAdminService::class);
            if ($firebase->isAvailable()) {
                if ($newRole === 'admin') {
                    $firebase->grantAdminClaims($targetUser->email, $admin->name);
                } elseif ($oldRole === 'admin') {
                    $firebase->revokeAdminClaims($targetUser->email, $admin->name);
                }
            }
        } catch (\Exception $fbErr) {
            \Illuminate\Support\Facades\Log::warning('[AdminUserController] Firebase claims sync notice: ' . $fbErr->getMessage());
        }

        AuditLog::create([
            'user_id' => $admin->id,
            'actor_name' => $admin->name,
            'action' => 'USER_ROLE_CHANGED',
            'details' => "Changed role of {$targetUser->email} from {$oldRole} to {$newRole}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "صارف کا کردار کامیابی سے {$newRole} کر دیا گیا ہے۔ (User role updated to {$newRole})",
            'data' => $targetUser,
        ], 200);
    }

    /**
     * Toggle or update user account status (active, suspended, disabled).
     */
    public function toggleStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:active,suspended,disabled'],
        ]);

        $admin = $request->user();
        $targetUser = User::findOrFail($id);

        if ($targetUser->id === $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'آپ اپنے اکاؤنٹ کو معطل یا غیر فعال نہیں کر سکتے۔ (Cannot suspend/disable your own account)',
            ], 403);
        }

        $newStatus = $request->input('status');
        $targetUser->status = $newStatus;
        $targetUser->save();

        // If suspended or disabled, invalidate all active tokens and sessions immediately
        if (in_array($newStatus, ['suspended', 'disabled'])) {
            $targetUser->tokens()->delete();
            UserSession::where('user_id', $targetUser->id)->update(['is_revoked' => true]);
        }

        AuditLog::create([
            'user_id' => $admin->id,
            'actor_name' => $admin->name,
            'action' => 'USER_STATUS_CHANGED',
            'details' => "Changed status of {$targetUser->email} to {$newStatus}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "صارف کی حیثیت کامیابی سے {$newStatus} کر دی گئی ہے۔ (User status updated to {$newStatus})",
            'data' => $targetUser,
        ], 200);
    }

    /**
     * Force revoke all active sessions and tokens for a specific user.
     */
    public function revokeSessions(Request $request, $id): JsonResponse
    {
        $admin = $request->user();
        $targetUser = User::findOrFail($id);

        $targetUser->tokens()->delete();
        UserSession::where('user_id', $targetUser->id)->update(['is_revoked' => true]);

        AuditLog::create([
            'user_id' => $admin->id,
            'actor_name' => $admin->name,
            'action' => 'ADMIN_FORCE_LOGOUT',
            'details' => "Admin {$admin->name} revoked all sessions for user {$targetUser->email}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "صارف {$targetUser->name} کے تمام سیشنز اور ٹوکنز منسوخ کر دیے گئے ہیں۔ (All sessions revoked)",
        ], 200);
    }
}
