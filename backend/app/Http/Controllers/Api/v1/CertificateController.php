<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CertificateController extends Controller
{
    /**
     * List certificates for authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $certificates = Certificate::where('user_id', $user->id)
            ->with(['course:id,title,title_ur,slug', 'quiz:id,title,title_ur,slug'])
            ->orderBy('issued_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $certificates,
        ], 200);
    }

    /**
     * Get certificate details by ID.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $certificate = Certificate::with(['course', 'quiz', 'user:id,name,email'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'سند نہیں ملی۔ (Certificate not found)',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $certificate,
        ], 200);
    }

    /**
     * Public verification of certificate by unique verification code.
     * Publicly accessible endpoint without authentication.
     */
    public function verifyPublic(Request $request, $code): JsonResponse
    {
        $code = trim($code);

        $certificate = Certificate::with([
            'course:id,title,title_ur,slug',
            'quiz:id,title,title_ur,slug',
            'user:id,name'
        ])->where('certificate_code', $code)->first();

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'valid' => false,
                'message' => 'یہ تصدیقی کوڈ غلط ہے یا کوئی سند موجود نہیں ہے۔ (Invalid certificate verification code)',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'valid' => true,
            'message' => 'سند اصلی اور تصدیق شدہ ہے۔ (Certificate is authentic and verified)',
            'data' => [
                'certificate_code' => $certificate->certificate_code,
                'recipient_name' => $certificate->recipient_name ?: $certificate->user?->name,
                'title' => $certificate->title,
                'title_ur' => $certificate->title_ur,
                'type' => $certificate->type,
                'grade' => $certificate->grade,
                'score_percentage' => $certificate->score_percentage,
                'issued_at' => $certificate->issued_at,
                'is_authentic' => true,
                'institution' => 'LearnHub Online Islamic Learning Portal',
                'course' => $certificate->course,
                'quiz' => $certificate->quiz,
            ]
        ], 200);
    }
}
